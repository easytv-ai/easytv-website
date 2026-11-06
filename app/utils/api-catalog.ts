export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type AuthKind = 'none' | 'user' | 'admin' | 'root'
export type LocText = { zh: string; en: string }

export interface ApiField {
  name: string
  type: string
  loc: 'header' | 'query' | 'path' | 'body'
  required?: boolean
  desc: LocText
  example?: string
}

export interface ApiError {
  message: string
  desc: LocText
}

export interface ApiEndpoint {
  slug: string
  group: string
  method: HttpMethod
  path: string
  title: LocText
  summary: LocText
  auth: AuthKind
  headers: ApiField[]
  params?: ApiField[]
  body?: ApiField[]
  contentType?: string
  requestExample?: string
  curl?: string
  responseJson: string
  responseNote?: LocText
  errors?: ApiError[]
}

export interface ApiGroup {
  id: string
  slug: string
  title: LocText
  summary: LocText
  endpoints: ApiEndpoint[]
}

export function L(zh: string, en: string): LocText {
  return { zh, en }
}

export function pick(text: LocText, locale: string) {
  return locale.startsWith('en') ? text.en : text.zh
}

function f(name: string, type: string, loc: ApiField['loc'], zh: string, en: string, required = false, example?: string): ApiField {
  return { name, type, loc, required, desc: L(zh, en), example }
}

const page = f('page', 'integer', 'query', '页码，从 1 开始', 'Page number, 1-based', false, '1')
const pageSize = f('page_size', 'integer', 'query', '每页条数，默认 20，上限 100', 'Page size, default 20, max 100', false, '20')
const idPath = f('id', 'integer', 'path', '资源 id', 'Resource id', true)

const hdrAuth = f('Authorization', 'string', 'header', 'Bearer <access_token>', 'Bearer <access_token>', true)
const hdrUser = f('EasyTV-User', 'string', 'header', '当前用户 id，必须与 token 一致', 'Current user id; must match the token', true)
const hdrJson = f('Content-Type', 'string', 'header', 'application/json', 'application/json', true)
const hdrLang = f('Accept-Language', 'string', 'header', '转发给网关，用于模型文案语言', 'Forwarded to the gateway for copy language')
const hdrTeam = f('EasyTV-Team', 'string', 'header', '团队空间 id。缺省 / 0 为个人空间', 'Team space id. Missing / 0 is personal space')

function headersFor(auth: AuthKind, hasJsonBody: boolean, extra: ApiField[] = []): ApiField[] {
  const list: ApiField[] = []
  if (auth !== 'none') list.push(hdrAuth, hdrUser)
  if (hasJsonBody) list.push(hdrJson)
  list.push(...extra)
  return list
}

const errParam: ApiError = { message: '无效的参数', desc: L('JSON 解不出，或必填为空', 'Bad JSON or an empty required field') }
const errGone: ApiError = { message: '资源不存在', desc: L('越权或记录不存在，不区分以免枚举', 'Missing or no access; not distinguishable') }
const errAuth: ApiError = { message: '用户名或密码错误', desc: L('登录失败，不区分账号是否存在', 'Login failed; does not reveal whether the account exists') }
const errPerm: ApiError = { message: '权限不足', desc: L('普通管理员调用了 RootAuth 接口', 'A regular admin hit a RootAuth route') }
const errCredits: ApiError = { message: '积分不足，还需 N 积分', desc: L('创建任务预扣失败', 'Not enough credits to freeze for the task') }
const errModel: ApiError = { message: '模型暂未接入', desc: L('model 不在 model_price 生效清单，不落库', 'model is not on the live model_price list; nothing is stored') }

function ok(data: string) {
  return `{
  "success": true,
  "message": "",
  "data": ${data}
}`
}

function ep(
  group: string,
  slug: string,
  method: HttpMethod,
  path: string,
  title: LocText,
  summary: LocText,
  auth: AuthKind,
  rest: Omit<Partial<ApiEndpoint>, 'slug' | 'group' | 'method' | 'path' | 'title' | 'summary' | 'auth'> & {
    responseJson: string
  },
): ApiEndpoint {
  const hasBody = Boolean(rest.body?.length || (rest.requestExample && rest.contentType !== 'multipart/form-data'))
  return {
    group,
    slug,
    method,
    path,
    title,
    summary,
    auth,
    headers: rest.headers ?? headersFor(auth, hasBody && rest.contentType !== 'multipart/form-data'),
    params: rest.params,
    body: rest.body,
    contentType: rest.contentType,
    requestExample: rest.requestExample,
    curl: rest.curl,
    responseJson: rest.responseJson,
    responseNote: rest.responseNote,
    errors: rest.errors,
  }
}

const loginData = `{
    "id": 1,
    "username": "demo@easytv.ai",
    "nickname": "demo",
    "role": 1,
    "status": 1,
    "group": "default",
    "access_token": "sk-••••"
  }`

const projectItem = `{
        "id": 12,
        "name": "夜城短剧",
        "description": "",
        "cover_url": "https://cdn.example/cover.jpg",
        "canvas_id": 88,
        "status": 1,
        "created_at": 1730000000,
        "updated_at": 1730000100,
        "deleted_at": 0
      }`

const assetItem = `{
        "id": 42,
        "type": "image",
        "name": "frame.png",
        "url": "https://cdn.example/easytv/frame.png",
        "cover_url": "",
        "mime": "image/png",
        "size": 204800,
        "width": 1920,
        "height": 1080,
        "duration": 0,
        "source": "upload",
        "created_at": 1730000000
      }`

export const API_TOP_LEVEL: ApiEndpoint[] = [
  ep('root', 'api-healthz', 'GET', '/healthz', L('健康检查', 'Health check'), L('匿名探针。Docker 与 Compose 用它做存活检查。HTTP 200，body 不是通用响应包。', 'Anonymous probe used by Docker and Compose. HTTP 200; the body is not the usual envelope.'), 'none', {
    headers: [],
    responseJson: `{ "status": "ok" }`,
    responseNote: L('注意：没有 success / message / data 包装。', 'Note: this is not wrapped in success / message / data.'),
  }),
]

const auth: ApiEndpoint[] = [
  ep('auth', 'api-auth-login', 'POST', '/user/login', L('密码登录', 'Password login'), L('邮箱或用户名 + 密码。无需鉴权。字段名是 username，不是 email。', 'Email or username + password. No auth. The field is username, not email.'), 'none', {
    body: [
      f('username', 'string', 'body', '邮箱或用户名，不是 email', 'Email or username — not email', true),
      f('password', 'string', 'body', '密码', 'Password', true),
    ],
    requestExample: '{"username":"demo@easytv.ai","password":"demo123456"}',
    responseJson: ok(loginData),
    responseNote: L('之后每个需登录请求带 Authorization 和 EasyTV-User。本地 seed：demo@easytv.ai / demo123456。', 'Send Authorization and EasyTV-User on every authed call after this. Seed: demo@easytv.ai / demo123456.'),
    errors: [errParam, errAuth],
  }),
  ep('auth', 'api-auth-sms', 'GET', '/sms/verification', L('发送短信验证码', 'Send SMS code'), L('无需鉴权。限流；重发间隔内再调返回「发送过于频繁，请稍后再试」。', 'No auth. Rate limited; a retry inside the window returns “发送过于频繁，请稍后再试”.'), 'none', {
    headers: [],
    params: [f('mobile', 'string', 'query', '大陆手机号', 'Mainland China mobile number', true, '13800138000')],
    responseJson: ok('null'),
    responseNote: L('测试号（SMS_TEST_ACCOUNTS）不发短信，登录时认固定验证码。', 'Test numbers (SMS_TEST_ACCOUNTS) skip SMS and accept a fixed code.'),
    errors: [
      { message: '手机号格式不正确', desc: L('mobile 不是 11 位大陆号', 'mobile is not an 11-digit CN number') },
      { message: '验证码发送失败', desc: L('短信通道异常', 'SMS provider failed') },
      { message: '发送过于频繁，请稍后再试', desc: L('触发限流', 'Rate limited') },
    ],
  }),
  ep('auth', 'api-auth-sms-login', 'POST', '/user/sms_login', L('短信登录', 'SMS login'), L('手机号验证码登录。用户不存在则自动注册。无需鉴权。', 'Mobile + code. Missing users are registered. No auth.'), 'none', {
    body: [
      f('mobile', 'string', 'body', '大陆手机号', 'Mainland China mobile number', true),
      f('code', 'string', 'body', '6 位验证码', '6-digit code', true),
    ],
    requestExample: '{"mobile":"13800138000","code":"123456"}',
    responseJson: ok(loginData),
    errors: [
      errParam,
      { message: '手机号格式不正确', desc: L('mobile 非法', 'Invalid mobile') },
      { message: '验证码错误或已过期', desc: L('code 对不上或过期', 'Wrong or expired code') },
      { message: '登录失败，请稍后重试', desc: L('签发令牌失败', 'Token issue failed') },
    ],
  }),
  ep('auth', 'api-auth-logout', 'POST', '/user/logout', L('登出', 'Sign out'), L('清除当前 access_token。需要登录。', 'Clears the current access_token. Auth required.'), 'user', {
    responseJson: ok('null'),
  }),
  ep('auth', 'api-auth-register', 'POST', '/user/register', L('邮箱注册', 'Email register'), L('邮箱 + 密码注册。开启邮箱验证码时 verification_code 必填。', 'Email + password. verification_code is required when email verification is on.'), 'none', {
    body: [
      f('username', 'string', 'body', '邮箱', 'Email', true),
      f('password', 'string', 'body', '8–32 位', '8–32 characters', true),
      f('verification_code', 'string', 'body', '邮箱验证码（若开启）', 'Email code when enabled'),
      f('nickname', 'string', 'body', '可选，默认取邮箱前缀', 'Optional; defaults to the email local part'),
    ],
    requestExample: '{"username":"demo@easytv.ai","password":"demo123456","nickname":"demo"}',
    responseJson: ok(loginData),
    errors: [
      errParam,
      { message: '邮箱格式不正确', desc: L('username 不是邮箱', 'username is not an email') },
      { message: '该邮箱已被注册', desc: L('邮箱占用', 'Email already taken') },
    ],
  }),
]

const user: ApiEndpoint[] = [
  ep('user', 'api-user-self', 'GET', '/user/self', L('当前用户', 'Current user'), L('返回资料。不含 access_token。quota 是遗留字段，计费请看钱包。', 'Profile without access_token. quota is legacy — use the wallet for billing.'), 'user', {
    responseJson: ok(`{
    "id": 1,
    "username": "demo@easytv.ai",
    "nickname": "demo",
    "role": 1,
    "status": 1,
    "group": "default",
    "aff_code": "a1b2c3",
    "partner_id": 0,
    "created_at": 1730000000,
    "last_login_at": 1730001000
  }`),
    errors: [{ message: '用户不存在', desc: L('token 对应用户已删', 'The token user was deleted') }],
  }),
  ep('user', 'api-user-self-update', 'PUT', '/user/self', L('更新资料', 'Update profile'), L('改昵称或前端 setting JSON。', 'Update nickname or the frontend setting JSON.'), 'user', {
    body: [
      f('nickname', 'string', 'body', '最多 20 字', 'Max 20 characters'),
      f('setting', 'string', 'body', '前端配置 JSON 字符串', 'Frontend settings JSON string'),
    ],
    requestExample: '{"nickname":"demo"}',
    responseJson: ok('null'),
    errors: [errParam, { message: '昵称过长', desc: L('超过 20 字', 'Longer than 20 characters') }],
  }),
  ep('user', 'api-user-mobile', 'POST', '/user/self/mobile', L('绑定手机', 'Bind mobile'), L('绑定 / 换绑手机号。验证码走 GET /sms/verification。短信注册账号的 username 会同步成新号。', 'Bind or change mobile. Code from GET /sms/verification. SMS-registered usernames sync to the new number.'), 'user', {
    body: [
      f('mobile', 'string', 'body', '新手机号', 'New mobile number', true),
      f('code', 'string', 'body', '短信验证码', 'SMS code', true),
    ],
    requestExample: '{"mobile":"13800138000","code":"123456"}',
    responseJson: ok('null'),
  }),
  ep('user', 'api-user-deactivate', 'POST', '/user/self/deactivate', L('自助注销', 'Deactivate account'), L('管理员不可注销。团队 owner 需先移除其他成员。积分与会员作废不退款。', 'Admins cannot self-deactivate. Team owners must remove other members first. Credits and membership are forfeited.'), 'user', {
    body: [f('password', 'string', 'body', '有密码的账号必填', 'Required when the account has a password')],
    requestExample: '{"password":"demo123456"}',
    responseJson: ok('null'),
  }),
  ep('user', 'api-user-notification', 'GET', '/user/notification', L('站内通知', 'Notifications'), L('当前用户的站内通知列表。', 'In-app notifications for the current user.'), 'user', {
    params: [f('unread', 'integer', 'query', '1 只看未读', '1 = unread only', false, '1'), page, pageSize],
    responseJson: ok(`{ "items": [{ "id": 9, "type": "work_reviewed", "title": "作品已通过审核", "read": false, "created_at": 1730000000 }], "total": 1 }`),
  }),
  ep('user', 'api-user-notification-read', 'POST', '/user/notification/read', L('标记已读', 'Mark read'), L('ids 为空则全部已读。', 'Empty ids marks everything read.'), 'user', {
    body: [f('ids', 'integer[]', 'body', '通知 id 列表，可空', 'Notification ids; optional')],
    requestExample: '{"ids":[9]}',
    responseJson: ok('null'),
  }),
]

const project: ApiEndpoint[] = [
  ep('project', 'api-project-list', 'GET', '/user/project', L('项目列表', 'List projects'), L('我的项目。列表 cover_url 为空时会附带最近一张画面，不写回数据库。canvas_id 是最近更新的画布，点卡片直接打开。', 'My projects. An empty cover_url is filled with a recent frame in the list only. canvas_id is the latest canvas — open it from the card.'), 'user', {
    params: [f('keyword', 'string', 'query', '按名称模糊搜', 'Fuzzy name search'), page, pageSize],
    responseJson: ok(`{ "items": [${projectItem}], "total": 1 }`),
  }),
  ep('project', 'api-project-create', 'POST', '/user/project', L('新建项目', 'Create project'), L('作品容器。画布也可以不传 project_id，后端会自动建同名项目。', 'A film container. Creating a canvas without project_id also creates a same-name project.'), 'user', {
    body: [
      f('name', 'string(100)', 'body', '项目名', 'Project name', true),
      f('description', 'string(500)', 'body', '简介', 'Description'),
    ],
    requestExample: '{"name":"夜城短剧","description":""}',
    responseJson: ok(projectItem),
    errors: [errParam],
  }),
  ep('project', 'api-project-get', 'GET', '/user/project/:id', L('项目详情', 'Get project'), L('带该项目下的画布列表（不含 graph）。', 'Includes canvases under the project (no graph).'), 'user', {
    params: [idPath],
    responseJson: ok(`{ "project": ${projectItem}, "canvases": [{ "id": 88, "name": "未命名草稿", "updated_at": 1730000100 }] }`),
    errors: [errGone],
  }),
  ep('project', 'api-project-update', 'PUT', '/user/project/:id', L('更新项目', 'Update project'), L('改名 / 描述 / 封面。字段均可选。画布改名会同步项目名。', 'Rename / description / cover. All optional. Renaming a canvas also renames the project.'), 'user', {
    params: [idPath],
    body: [
      f('name', 'string', 'body', '项目名', 'Name'),
      f('description', 'string', 'body', '简介', 'Description'),
      f('cover_url', 'string', 'body', '封面地址', 'Cover URL'),
    ],
    requestExample: '{"name":"夜城短剧 v2"}',
    responseJson: ok(projectItem),
    errors: [errParam, errGone],
  }),
  ep('project', 'api-project-delete', 'DELETE', '/user/project/:id', L('删除项目', 'Delete project'), L('进回收站，级联其画布。30 天后物理清理。', 'Moves to trash and cascades canvases. Physical cleanup after 30 days.'), 'user', {
    params: [idPath],
    responseJson: ok('null'),
    errors: [errGone],
  }),
  ep('project', 'api-project-restore', 'POST', '/user/project/:id/restore', L('恢复项目', 'Restore project'), L('从回收站恢复。', 'Restore from trash.'), 'user', {
    params: [idPath],
    responseJson: ok(projectItem),
    errors: [errGone],
  }),
  ep('project', 'api-project-trash', 'GET', '/user/project/trash', L('项目回收站', 'Project trash'), L('已软删的项目，项上带 deleted_at。', 'Soft-deleted projects, with deleted_at set.'), 'user', {
    params: [page, pageSize],
    responseJson: ok(`{ "items": [${projectItem.replace('"deleted_at": 0', '"deleted_at": 1730001000')}], "total": 1 }`),
  }),
]

const canvas: ApiEndpoint[] = [
  ep('canvas', 'api-canvas-list', 'GET', '/user/canvas', L('画布列表', 'List canvases'), L('列表一般不含完整 graph。', 'The list usually omits the full graph.'), 'user', {
    params: [f('project_id', 'integer', 'query', '按项目过滤', 'Filter by project'), page, pageSize],
    responseJson: ok(`{ "items": [{ "id": 88, "project_id": 12, "name": "未命名草稿", "version": 7, "thumbnail_url": "", "updated_at": 1730000100 }], "total": 1 }`),
  }),
  ep('canvas', 'api-canvas-create', 'POST', '/user/canvas', L('新建画布', 'Create canvas'), L('不传 project_id 时后端自动新建同名项目并关联。graph 上限 2 MB，后端不解析节点语义。', 'Omitting project_id creates a same-name project. graph max 2 MB; the backend does not parse node semantics.'), 'user', {
    body: [
      f('name', 'string', 'body', '草稿名', 'Draft name', true),
      f('project_id', 'integer', 'body', '所属项目，可空', 'Parent project; optional'),
      f('graph', 'object', 'body', '{ nodes, edges, viewport }，默认空图', '{ nodes, edges, viewport }; empty by default'),
    ],
    requestExample: '{"name":"未命名草稿","graph":{"nodes":[],"edges":[],"viewport":{"x":0,"y":0,"zoom":1}}}',
    responseJson: ok(`{ "id": 88, "project_id": 12, "name": "未命名草稿", "version": 1, "graph": { "nodes": [], "edges": [], "viewport": { "x": 0, "y": 0, "zoom": 1 } } }`),
  }),
  ep('canvas', 'api-canvas-get', 'GET', '/user/canvas/:id', L('画布详情', 'Get canvas'), L('含完整 graph 和当前 version。打开画布必须先拉这一份，保存时把 version 原样带回去。', 'Full graph and current version. Load this first; send the same version back on save.'), 'user', {
    params: [idPath],
    responseJson: ok(`{
    "id": 88,
    "project_id": 12,
    "name": "未命名草稿",
    "version": 7,
    "graph": {
      "nodes": [{ "id": "image-1", "type": "easytv", "position": { "x": 0, "y": 0 }, "data": { "kind": "image", "label": "图片1" } }],
      "edges": [],
      "viewport": { "x": 0, "y": 0, "zoom": 1 }
    },
    "thumbnail_url": "",
    "updated_at": 1730000100
  }`),
    errors: [errGone],
  }),
  ep('canvas', 'api-canvas-update', 'PUT', '/user/canvas/:id', L('保存画布', 'Save canvas'), L('必须带当前 version，否则返回「画布已在其他地方修改，请刷新」。snapshot: true 单独记一条手动版本。', 'version is required or you get “画布已在其他地方修改，请刷新”. snapshot: true writes a manual version.'), 'user', {
    params: [idPath],
    body: [
      f('version', 'integer', 'body', '乐观锁，必填', 'Optimistic lock; required', true),
      f('name', 'string', 'body', '改名同时更新所属项目名', 'Also renames the parent project'),
      f('graph', 'object', 'body', '整张替换，上限 2 MB', 'Full replace, max 2 MB'),
      f('thumbnail_url', 'string', 'body', '缩略图', 'Thumbnail'),
      f('snapshot', 'boolean', 'body', 'true 时记一条 manual 版本', 'true writes a manual version'),
      f('note', 'string(100)', 'body', '版本备注', 'Version note'),
    ],
    requestExample: '{"version":7,"graph":{"nodes":[],"edges":[],"viewport":{"x":0,"y":0,"zoom":1}},"snapshot":false}',
    responseJson: ok(`{ "id": 88, "version": 8, "updated_at": 1730000200 }`),
    responseNote: L('成功只回轻量字段。自动保存约 10 分钟合并一条 source=auto。', 'Success returns a light payload. Autosave merges into one source=auto row about every 10 minutes.'),
    errors: [errGone, { message: '画布已在其他地方修改，请刷新', desc: L('version 对不上', 'version mismatch') }],
  }),
  ep('canvas', 'api-canvas-delete', 'DELETE', '/user/canvas/:id', L('删除画布', 'Delete canvas'), L('进回收站。所属项目在回收站时，恢复画布会一并恢复项目。', 'Moves to trash. Restoring a canvas also restores a trashed parent project.'), 'user', {
    params: [idPath],
    responseJson: ok('null'),
    errors: [errGone],
  }),
  ep('canvas', 'api-canvas-versions', 'GET', '/user/canvas/:id/versions', L('版本历史', 'Version history'), L('最多 50 条。列表不含 graph。source：auto / manual / restore。', 'Max 50. List omits graph. source: auto / manual / restore.'), 'user', {
    params: [idPath],
    responseJson: ok(`{ "items": [{ "id": 3, "version": 7, "name": "未命名草稿", "node_count": 4, "source": "manual", "note": "", "created_at": 1730000100 }] }`),
  }),
  ep('canvas', 'api-canvas-restore-version', 'POST', '/user/canvas/:id/versions/:vid/restore', L('回滚版本', 'Restore version'), L('先备份当前状态，再覆盖 graph，返回新的画布详情（含 graph 与 version）。', 'Backs up current state, then overwrites graph and returns the new canvas (graph + version).'), 'user', {
    params: [idPath, f('vid', 'integer', 'path', '版本 id', 'Version id', true)],
    responseJson: ok(`{ "id": 88, "version": 9, "graph": { "nodes": [], "edges": [], "viewport": { "x": 0, "y": 0, "zoom": 1 } } }`),
    errors: [errGone],
  }),
  ep('canvas', 'api-canvas-share', 'PUT', '/user/canvas/:id/share', L('分享开关', 'Share toggle'), L('PUT { enabled }。返回 token 与 path（/share/<token>）。关闭后 token 保留但链接失效。读取状态用 GET 同路径。', 'PUT { enabled }. Returns token and path (/share/<token>). Disabling keeps the token but invalidates the link. GET the same path for status.'), 'user', {
    params: [idPath],
    body: [f('enabled', 'boolean', 'body', '是否开启只读分享', 'Enable read-only share', true)],
    requestExample: '{"enabled":true}',
    responseJson: ok(`{ "enabled": true, "token": "share_xxx", "path": "/share/share_xxx" }`),
  }),
  ep('canvas', 'api-canvas-chat', 'POST', '/user/canvas/:id/chat', L('保存对话', 'Save chat'), L('画布右侧对话。进行中的气泡和 undoToken 不入库。单段最多 200 条、2 MB。', 'Canvas chat. In-progress bubbles and undoToken are not stored. Max 200 messages / 2 MB per thread.'), 'user', {
    params: [idPath],
    body: [
      f('title', 'string', 'body', '会话标题', 'Thread title'),
      f('messages', 'array', 'body', '气泡数组，role 为 user / assistant', 'Bubbles; role is user / assistant', true),
    ],
    requestExample: '{"title":"分镜","messages":[{"role":"user","text":"先出三镜"}]}',
    responseJson: ok(`{ "id": 7, "title": "分镜", "message_count": 1 }`),
  }),
]

const asset: ApiEndpoint[] = [
  ep('asset', 'api-asset-list', 'GET', '/user/asset', L('资产列表', 'List assets'), L('上传 source=upload，生成产物 generated，媒体工具 media。视频刚上传时 cover_url 可能为空（异步抽帧）。', 'source=upload / generated / media. cover_url on a fresh video may be empty until the poster job finishes.'), 'user', {
    params: [
      f('type', 'string', 'query', 'image / video / audio / text / other', 'image / video / audio / text / other'),
      f('project_id', 'integer', 'query', '按项目过滤', 'Filter by project'),
      f('source', 'string', 'query', 'upload / generated / media', 'upload / generated / media'),
      f('keyword', 'string', 'query', '文件名', 'File name'),
      page, pageSize,
    ],
    responseJson: ok(`{ "items": [${assetItem}], "total": 1 }`),
  }),
  ep('asset', 'api-asset-get', 'GET', '/user/asset/:id', L('资产详情', 'Get asset'), L('单个资产。画布从技能页带素材进来时用。', 'One asset. Used when a skill injects media onto the canvas.'), 'user', {
    params: [idPath],
    responseJson: ok(assetItem),
    errors: [errGone],
  }),
  ep('asset', 'api-asset-upload', 'POST', '/user/asset/upload', L('上传资产', 'Upload asset'), L('multipart，字段 file，可选 project_id。类型按 MIME 判断。单文件上限默认 200 MB（UPLOAD_MAX_MB）。', 'multipart field file, optional project_id. Type from MIME. Default max 200 MB (UPLOAD_MAX_MB).'), 'user', {
    headers: [hdrAuth, hdrUser],
    contentType: 'multipart/form-data',
    body: [
      f('file', 'file', 'body', '二进制文件', 'Binary file', true),
      f('project_id', 'integer', 'body', '挂到项目', 'Attach to a project'),
    ],
    curl: `curl -X POST "$API/user/asset/upload" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "EasyTV-User: $UID" \\
  -F "file=@./frame.png" \\
  -F "project_id=12"`,
    responseJson: ok(assetItem),
  }),
  ep('asset', 'api-asset-import', 'POST', '/user/asset/import', L('导入资产', 'Import asset'), L('从已有资产或外部 URL 引入。七牛直传后也走这条登记。', 'Import from an existing asset or URL. Qiniu direct-upload also registers here.'), 'user', {
    body: [
      f('url', 'string', 'body', '外部地址', 'External URL'),
      f('asset_id', 'integer', 'body', '已有资产 id', 'Existing asset id'),
      f('project_id', 'integer', 'body', '目标项目', 'Target project'),
    ],
    requestExample: '{"url":"https://cdn.example/frame.png","project_id":12}',
    responseJson: ok(assetItem),
  }),
  ep('asset', 'api-asset-delete', 'DELETE', '/user/asset/:id', L('删除资产', 'Delete asset'), L('进回收站，文件保留 30 天。', 'Moves to trash; the file is kept 30 days.'), 'user', {
    params: [idPath],
    responseJson: ok('null'),
    errors: [errGone],
  }),
  ep('asset', 'api-asset-restore', 'POST', '/user/asset/:id/restore', L('恢复资产', 'Restore asset'), L('从回收站恢复。', 'Restore from trash.'), 'user', {
    params: [idPath],
    responseJson: ok(assetItem),
    errors: [errGone],
  }),
]

const task: ApiEndpoint[] = [
  ep('task', 'api-task-create', 'POST', '/user/task', L('创建生成任务', 'Create task'), L('积分按 model_price 先预扣（freeze），成功 settle，失败 / 取消 unfreeze。params.count 只能是 1。生成只走 EasyAPI / New API 兼容网关。', 'Credits freeze on create, settle on success, unfreeze on fail/cancel. params.count must be 1. Generation goes only through an EasyAPI / New API compatible gateway.'), 'user', {
    headers: headersFor('user', true, [hdrTeam]),
    body: [
      f('type', 'string', 'body', 'text / image / video / audio', 'text / image / video / audio', true),
      f('model', 'string', 'body', '与 GET /generation/models 的 model 一致', 'Must match GET /generation/models', true),
      f('prompt', 'string', 'body', '提示词', 'Prompt', true),
      f('params', 'object', 'body', '透传：ratio / aspect_ratio、resolution、duration、size、generate_audio、seed、voice、negative_prompt', 'Passthrough: ratio / aspect_ratio, resolution, duration, size, generate_audio, seed, voice, negative_prompt'),
      f('inputs', 'array', 'body', '[{ asset_id, role }]。role：first_frame / last_frame / reference / reference_video / reference_audio / image', '[{ asset_id, role }]. role: first_frame / last_frame / reference / reference_video / reference_audio / image'),
      f('canvas_id', 'integer', 'body', '回填画布', 'Canvas to write back'),
      f('node_id', 'string', 'body', '回填节点', 'Node to write back'),
      f('project_id', 'integer', 'body', '所属项目', 'Project'),
      f('skill_id', 'integer', 'body', '文本任务会把技能执行规则拼到提示词前', 'For text tasks, injects the skill contract in front of the prompt'),
    ],
    requestExample: '{"type":"video","model":"Kling-2.5","prompt":"主角走过天台边缘，城市灯光在身后。","params":{"duration":5,"resolution":"1080P","ratio":"16:9"},"inputs":[{"asset_id":42,"role":"first_frame"}],"canvas_id":88,"node_id":"video-1"}',
    responseJson: ok(`{
    "id": 1001,
    "task_no": "GT20261105001",
    "type": "video",
    "model": "Kling-2.5",
    "status": "pending",
    "progress": 0,
    "points_frozen": 150,
    "cost_points": 0
  }`),
    responseNote: L('拿到 id 后轮询 GET /user/task/:id。文本任务成功看 result_text；其它看 result_url / result_asset_id。', 'Poll GET /user/task/:id. Text tasks return result_text; others return result_url / result_asset_id.'),
    errors: [errParam, errCredits, errModel, { message: '模型 X 未定价', desc: L('清单有模型但未标价', 'Model exists but is not priced') }],
  }),
  ep('task', 'api-task-get', 'GET', '/user/task/:id', L('任务详情', 'Get task'), L('前端 1–2 秒轮询直到终态：succeeded / failed / cancelled。', 'Poll every 1–2s until succeeded / failed / cancelled.'), 'user', {
    params: [idPath],
    responseJson: ok(`{
    "id": 1001,
    "task_no": "GT20261105001",
    "type": "video",
    "model": "Kling-2.5",
    "status": "running",
    "progress": 40,
    "points_frozen": 150,
    "cost_points": 0,
    "result_url": "",
    "result_asset_id": 0,
    "error_msg": ""
  }`),
    errors: [errGone],
  }),
  ep('task', 'api-task-list', 'GET', '/user/task', L('任务列表', 'List tasks'), L('任务中心。', 'Task inbox.'), 'user', {
    params: [
      f('canvas_id', 'integer', 'query', '这张画布', 'This canvas'),
      f('status', 'string', 'query', 'pending / running / succeeded / failed / cancelled', 'pending / running / succeeded / failed / cancelled'),
      f('keyword', 'string', 'query', '提示词 / 模型 / 单号', 'Prompt / model / task_no'),
      f('active', 'integer', 'query', '1 只看进行中', '1 = in-flight only'),
      page, pageSize,
    ],
    responseJson: ok(`{ "items": [{ "id": 1001, "status": "running", "progress": 40, "model": "Kling-2.5" }], "total": 1 }`),
  }),
  ep('task', 'api-task-summary', 'GET', '/user/task/summary', L('任务概览', 'Task summary'), L('任务中心顶部数字。', 'Headline numbers for the task inbox.'), 'user', {
    responseJson: ok(`{ "total": 12, "active": 1, "succeeded": 9, "failed": 1, "cancelled": 1, "points_today": 300, "points_30d": 4200, "points_frozen": 150 }`),
  }),
  ep('task', 'api-task-cancel', 'POST', '/user/task/:id/cancel', L('取消任务', 'Cancel task'), L('仅 pending / running。取消后预扣退回。', 'Only pending / running. Frozen credits are returned.'), 'user', {
    params: [idPath],
    responseJson: ok(`{ "id": 1001, "status": "cancelled" }`),
    errors: [errGone],
  }),
  ep('task', 'api-task-retry', 'POST', '/user/task/:id/retry', L('重试任务', 'Retry task'), L('按原参数新建任务并重新预扣，返回新任务。旧参数里 count > 1 会改成 1 再计费。', 'Creates a new task with the same params and a new freeze. count > 1 is coerced to 1.'), 'user', {
    params: [idPath],
    responseJson: ok(`{ "id": 1002, "status": "pending", "points_frozen": 150 }`),
    errors: [errGone, errCredits],
  }),
]

const models: ApiEndpoint[] = [
  ep('models', 'api-models-list', 'GET', '/generation/models', L('可用模型', 'List models'), L('可匿名。清单 = model_price.status=1，是创建任务的唯一白名单。网关没配或表空时返回 []。', 'Anonymous. The list is model_price.status=1 — the only whitelist for create-task. Empty if the gateway is unset or the table is empty.'), 'none', {
    headers: [],
    responseJson: ok(`[
    {
      "provider": "easyapi",
      "model": "Kling-2.5",
      "type": "video",
      "label": "Kling 2.5",
      "unit": "second",
      "points_per_unit": 30,
      "member_points_per_unit": 24,
      "priced": true,
      "abilities": ["native_audio"]
    }
  ]`),
  }),
  ep('models', 'api-models-detail', 'GET', '/generation/models/detail', L('模型详情', 'Model detail'), L('本地积分定价 + 网关展示元数据。网关挂了也不报错：定价照常返回，展示字段为空，gateway_available: false。', 'Local credit price plus gateway display metadata. A down gateway still returns prices with empty display fields and gateway_available: false.'), 'none', {
    headers: [hdrLang],
    params: [f('model', 'string', 'query', '模型标识，兼容 model_name', 'Model id; model_name also accepted', true, 'Kling-2.5')],
    responseJson: ok(`{
    "model": "Kling-2.5",
    "type": "video",
    "points_per_unit": 30,
    "member_points_per_unit": 24,
    "description": "",
    "params": [],
    "durations": [5, 10],
    "resolutions": ["720P", "1080P"],
    "gateway_available": true
  }`),
    errors: [
      { message: '缺少模型标识 model', desc: L('没传 model', 'model missing') },
      { message: '模型不存在或未上架', desc: L('不在生效清单', 'Not on the live list') },
    ],
  }),
]

const work: ApiEndpoint[] = [
  ep('work', 'api-work-list', 'GET', '/user/work', L('我的作品', 'My works'), L('status：0 草稿 / 1 已发布 / 2 已下架 / -1 审核驳回。', 'status: 0 draft / 1 published / 2 unpublished / -1 rejected.'), 'user', {
    params: [f('status', 'integer', 'query', '按状态过滤', 'Filter by status'), f('keyword', 'string', 'query', '标题模糊搜', 'Fuzzy title'), page, pageSize],
    responseJson: ok(`{ "items": [{ "id": 21, "title": "赛博夜雨", "status": 1, "review_status": 1 }], "total": 1 }`),
  }),
  ep('work', 'api-work-create', 'POST', '/user/work', L('发布作品', 'Publish work'), L('从资产发布，直接 status=1。cover_url 留空则用成片抽帧。带上 canvas_id 才能公开制作过程。', 'Publish from an asset, status=1 immediately. Empty cover_url uses a video poster. canvas_id is required to expose the process.'), 'user', {
    body: [
      f('title', 'string', 'body', '标题', 'Title', true),
      f('description', 'string', 'body', '简介', 'Description'),
      f('asset_id', 'integer', 'body', '成片资产', 'Film asset', true),
      f('project_id', 'integer', 'body', '项目', 'Project'),
      f('canvas_id', 'integer', 'body', '画布，公开制作过程用', 'Canvas, for the public process'),
      f('cover_url', 'string', 'body', '封面，可空', 'Cover; optional'),
      f('category', 'string', 'body', '来自 GET /category?scope=work', 'From GET /category?scope=work'),
      f('show_process', 'boolean', 'body', '默认 true', 'Default true'),
    ],
    requestExample: '{"title":"赛博夜雨","asset_id":99,"canvas_id":88,"show_process":true}',
    responseJson: ok(`{ "id": 21, "title": "赛博夜雨", "status": 1, "review_status": 0 }`),
    errors: [errParam, errGone],
  }),
  ep('work', 'api-work-update', 'PUT', '/user/work/:id', L('更新作品', 'Update work'), L('传空串 cover_url 会重新抽帧。status 只接受 1 或 2。', 'Empty cover_url re-extracts a poster. status accepts 1 or 2 only.'), 'user', {
    params: [idPath],
    body: [
      f('title', 'string', 'body', '标题', 'Title'),
      f('description', 'string', 'body', '简介', 'Description'),
      f('cover_url', 'string', 'body', '封面', 'Cover'),
      f('category', 'string', 'body', '分类', 'Category'),
      f('status', 'integer', 'body', '1 发布 / 2 下架', '1 publish / 2 unpublish'),
      f('show_process', 'boolean', 'body', '是否公开制作过程', 'Expose the process'),
    ],
    requestExample: '{"status":2}',
    responseJson: ok(`{ "id": 21, "status": 2 }`),
    errors: [errGone],
  }),
  ep('work', 'api-work-like', 'POST', '/user/work/:id/like', L('点赞', 'Toggle like'), L('切换。公开列表带登录态时每条作品有 liked。', 'Toggle. Public lists include liked when authed.'), 'user', {
    params: [idPath],
    responseJson: ok(`{ "liked": true, "like_count": 12 }`),
  }),
  ep('work', 'api-work-comment', 'POST', '/user/work/:id/comment', L('发表评论', 'Post comment'), L('30 次/分钟。parent_id 表示回复。返回含 author。', '30/min. parent_id replies. Payload includes author.'), 'user', {
    params: [idPath],
    body: [
      f('content', 'string', 'body', '正文', 'Body', true),
      f('parent_id', 'integer', 'body', '回复的评论 id', 'Parent comment id'),
    ],
    requestExample: '{"content":"这一镜光很好"}',
    responseJson: ok(`{ "id": 55, "content": "这一镜光很好", "author": { "id": 1, "nickname": "demo" } }`),
  }),
  ep('work', 'api-work-report', 'POST', '/user/work/:id/report', L('举报作品', 'Report work'), L('reason + 可选补充。评论举报走 POST /user/comment/:id/report。', 'reason plus optional detail. Comment reports use POST /user/comment/:id/report.'), 'user', {
    params: [idPath],
    body: [
      f('reason', 'string', 'body', '原因', 'Reason', true),
      f('content', 'string', 'body', '补充说明', 'Extra detail'),
    ],
    requestExample: '{"reason":"侵权"}',
    responseJson: ok('null'),
  }),
]

const skill: ApiEndpoint[] = [
  ep('skill', 'api-skill-list', 'GET', '/user/skill', L('我的技能', 'My skills'), L('私有 Skill。官方技能走 GET /skill。', 'Private skills. Official ones are GET /skill.'), 'user', {
    params: [f('keyword', 'string', 'query', '名称', 'Name')],
    responseJson: ok(`{ "items": [{ "id": 3, "title": "分镜助手", "user_id": 1 }] }`),
  }),
  ep('skill', 'api-skill-create', 'POST', '/user/skill', L('新建技能', 'Create skill'), L('prompt 里 {{prompt}} 是灵感占位。canvas_id 把该画布去敏后的 graph 存成模板；传 0 清除。', '{{prompt}} in prompt is the inspiration slot. canvas_id stores a sanitized graph; 0 clears it.'), 'user', {
    body: [
      f('title', 'string', 'body', '名称', 'Title', true),
      f('prompt', 'string', 'body', '提示词模板', 'Prompt template', true),
      f('description', 'string', 'body', '一句话', 'One-liner'),
      f('category', 'string', 'body', '分类', 'Category'),
      f('cover_url', 'string', 'body', '封面', 'Cover'),
      f('scene', 'string', 'body', '适用场景', 'Scene'),
      f('howto', 'string', 'body', '输入说明', 'How-to'),
      f('output', 'string', 'body', '产出说明', 'Output'),
      f('canvas_id', 'integer', 'body', '从画布存为模板', 'Save canvas as template'),
    ],
    requestExample: '{"title":"分镜助手","prompt":"根据 {{prompt}} 拆 6 镜"}',
    responseJson: ok(`{ "id": 3, "title": "分镜助手" }`),
  }),
  ep('skill', 'api-skill-get', 'GET', '/user/skill/:id', L('技能详情', 'Get skill'), L('含 graph。官方已上架技能也可读。', 'Includes graph. Official listed skills are also readable.'), 'user', {
    params: [idPath],
    responseJson: ok(`{ "id": 3, "title": "分镜助手", "prompt": "根据 {{prompt}} 拆 6 镜", "graph": null }`),
    errors: [errGone],
  }),
  ep('skill', 'api-skill-favorite', 'POST', '/user/skill/:id/favorite', L('收藏技能', 'Toggle favorite'), L('切换。带登录态的 GET /skill 每条会附 favorited。', 'Toggle. Authed GET /skill includes favorited.'), 'user', {
    params: [idPath],
    responseJson: ok(`{ "favorited": true, "stars": 18 }`),
  }),
  ep('skill', 'api-skill-favorites', 'GET', '/user/skill/favorites', L('我的收藏', 'My favorites'), L('收藏的官方 / 可见技能。', 'Favorited official / visible skills.'), 'user', {
    params: [f('keyword', 'string', 'query', '名称', 'Name'), f('category', 'string', 'query', '分类', 'Category')],
    responseJson: ok(`{ "items": [{ "id": 1, "title": "一句话成片", "favorited": true }] }`),
  }),
]

const wallet: ApiEndpoint[] = [
  ep('wallet', 'api-wallet-get', 'GET', '/user/wallet', L('钱包总览', 'Wallet'), L('积分是唯一计价单位。带 EasyTV-Team 时看团队空间钱包。没有会员时 membership 为 null。frozen 是进行中任务的预扣。', 'Credits are the only unit. EasyTV-Team switches to the team pool. membership is null without a plan. frozen is in-flight freeze.'), 'user', {
    headers: headersFor('user', false, [hdrTeam]),
    responseJson: ok(`{
    "balance": 12000,
    "frozen": 150,
    "expiring_in_7d": 800,
    "membership": {
      "plan_code": "creator",
      "plan_name": "创作",
      "edition": "creator",
      "seats": 1,
      "expires_at": 1738000000,
      "next_grant_at": 1732600000
    }
  }`),
  }),
  ep('wallet', 'api-wallet-log', 'GET', '/user/points/log', L('积分流水', 'Credit ledger'), L('amount 正入负出。biz_type + biz_no 指向订单号或任务单号。', 'amount is signed. biz_type + biz_no point at an order or task.'), 'user', {
    params: [f('type', 'string', 'query', 'grant / freeze / settle / unfreeze / expire / adjust', 'grant / freeze / settle / unfreeze / expire / adjust'), page, pageSize],
    responseJson: ok(`{ "items": [{ "id": 8, "type": "freeze", "amount": -150, "biz_type": "task", "biz_no": "GT20261105001", "created_at": 1730000000 }], "total": 1 }`),
  }),
  ep('wallet', 'api-wallet-lots', 'GET', '/user/points/lots', L('积分批次', 'Credit lots'), L('未过期批次，前端展示「XX 积分将于 X 日到期」。消耗最早过期优先。', 'Unexpired lots. UI shows “N credits expire on …”. Spend oldest-expiry first.'), 'user', {
    responseJson: ok(`{ "items": [{ "id": 2, "remain": 800, "expires_at": 1732600000 }] }`),
  }),
  ep('wallet', 'api-wallet-membership', 'GET', '/user/membership', L('当前会员', 'Membership'), L('字段同 wallet.membership，方便单独刷新。', 'Same shape as wallet.membership, for a cheap refresh.'), 'user', {
    responseJson: ok(`{ "plan_code": "creator", "plan_name": "创作", "edition": "creator", "seats": 1, "expires_at": 1738000000, "next_grant_at": 1732600000 }`),
  }),
]

const order: ApiEndpoint[] = [
  ep('order', 'api-order-plans', 'GET', '/billing/plans', L('套餐与积分包', 'Plans and packs'), L('匿名。只含上架项。promo.member_day 是每月会员日折扣。', 'Anonymous. Listed items only. promo.member_day is the monthly member-day sale.'), 'none', {
    headers: [],
    responseJson: ok(`{ "plans": [{ "code": "creator", "name": "创作", "price": 99 }], "packs": [{ "code": "p30", "points": 3000, "price": 30 }], "promo": {} }`),
  }),
  ep('order', 'api-order-quote', 'POST', '/billing/quote', L('报价', 'Quote'), L('可匿名；带登录态时积分包按会员价。请求字段与下单相同（不要 payment_method）。price 才是应付。', 'Anonymous; authed pack quotes use member price. Same fields as place-order minus payment_method. price is what you pay.'), 'none', {
    body: [
      f('kind', 'string', 'body', 'membership / points', 'membership / points', true),
      f('plan_code', 'string', 'body', '会员计划', 'Plan code'),
      f('pack_code', 'string', 'body', '积分包', 'Pack code'),
      f('edition', 'string', 'body', 'creator / team，仅会员', 'creator / team; membership only'),
      f('cycle', 'string', 'body', 'month / quarter / year', 'month / quarter / year'),
      f('seats', 'integer', 'body', '创作版恒 1；团队版 2–10', 'Always 1 for creator; 2–10 for team'),
      f('add_on', 'boolean', 'body', '是否加购积分', 'Add-on credits'),
    ],
    requestExample: '{"kind":"membership","plan_code":"creator","edition":"creator","cycle":"year","seats":1}',
    responseJson: ok(`{ "origin": 1188, "price": 999, "points": 12000, "title": "创作 · 年", "months": 12, "add_on_points": 0, "add_on_price": 0 }`),
  }),
  ep('order', 'api-order-create', 'POST', '/user/order', L('下单支付', 'Place order'), L('服务端重新计价。wechat_native / alipay_f2f 返回 code_url；alipay_pc 返回 payment_url。渠道未开通时 pay 为 null，订单保留 pending。', 'Server re-prices. wechat_native / alipay_f2f return code_url; alipay_pc returns payment_url. Unconfigured channels leave pay null and the order pending.'), 'user', {
    body: [
      f('kind', 'string', 'body', 'membership / points', 'membership / points', true),
      f('plan_code', 'string', 'body', '会员计划', 'Plan code'),
      f('pack_code', 'string', 'body', '积分包', 'Pack code'),
      f('edition', 'string', 'body', 'creator / team', 'creator / team'),
      f('cycle', 'string', 'body', 'month / quarter / year', 'month / quarter / year'),
      f('seats', 'integer', 'body', '席位', 'Seats'),
      f('add_on', 'boolean', 'body', '加购积分', 'Add-on credits'),
      f('payment_method', 'string', 'body', 'wechat_native / alipay_f2f / alipay_pc', 'wechat_native / alipay_f2f / alipay_pc', true),
    ],
    requestExample: '{"kind":"points","pack_code":"p30","payment_method":"wechat_native"}',
    responseJson: ok(`{
    "order": { "id": 77, "order_no": "E20261105001", "status": "pending", "amount": 30 },
    "quote": { "price": 30, "points": 3000 },
    "pay": { "payment_method": "wechat_native", "code_url": "weixin://wxpay/bizpayurl?pr=••••", "trade_no": "E20261105001", "expires_at": 1730001800 }
  }`),
  }),
  ep('order', 'api-order-get', 'GET', '/user/order/:id', L('订单详情', 'Get order'), L('支付页每 3 秒轮询直到 paid / closed。', 'Poll every 3s on the pay page until paid / closed.'), 'user', {
    params: [idPath],
    responseJson: ok(`{ "id": 77, "order_no": "E20261105001", "status": "paid", "amount": 30 }`),
    errors: [errGone],
  }),
  ep('order', 'api-order-list', 'GET', '/user/order', L('我的订单', 'My orders'), L('status：pending / paid / closed / refunded。', 'status: pending / paid / closed / refunded.'), 'user', {
    params: [f('status', 'string', 'query', '按状态过滤', 'Filter by status'), page, pageSize],
    responseJson: ok(`{ "items": [{ "id": 77, "status": "paid", "amount": 30 }], "total": 1 }`),
  }),
  ep('order', 'api-order-pay', 'POST', '/user/order/:id/pay', L('重新支付', 'Retry pay'), L('对待支付订单换渠道。', 'Re-open a pending order with another channel.'), 'user', {
    params: [idPath],
    body: [f('payment_method', 'string', 'body', 'wechat_native / alipay_f2f / alipay_pc', 'wechat_native / alipay_f2f / alipay_pc', true)],
    requestExample: '{"payment_method":"alipay_pc"}',
    responseJson: ok(`{ "pay": { "payment_method": "alipay_pc", "payment_url": "https://openapi.alipay.com/..." } }`),
  }),
  ep('order', 'api-order-close', 'POST', '/user/order/:id/close', L('取消订单', 'Close order'), L('取消待支付。', 'Cancel a pending order.'), 'user', {
    params: [idPath],
    responseJson: ok(`{ "id": 77, "status": "closed" }`),
  }),
]

const team: ApiEndpoint[] = [
  ep('team', 'api-team-get', 'GET', '/user/team', L('我的团队', 'My team'), L('不在团队时 data 为 null。invite_code 仅 owner 可见。一个人只属于一个团队。', 'data is null when not in a team. invite_code is owner-only. A user belongs to one team.'), 'user', {
    responseJson: ok(`{
    "id": 3,
    "name": "工作室",
    "owner_id": 1,
    "seats": 5,
    "used_seats": 2,
    "role": "owner",
    "members": [{ "user_id": 1, "nickname": "demo", "role": "owner" }],
    "active": true,
    "expires_at": 1738000000,
    "pool_balance": 40000,
    "invite_code": "AB12CD34"
  }`),
  }),
  ep('team', 'api-team-update', 'PUT', '/user/team', L('团队改名', 'Rename team'), L('仅 owner。', 'Owner only.'), 'user', {
    body: [f('name', 'string', 'body', '团队名', 'Team name', true)],
    requestExample: '{"name":"工作室"}',
    responseJson: ok(`{ "id": 3, "name": "工作室" }`),
    errors: [errPerm],
  }),
  ep('team', 'api-team-invite', 'POST', '/user/team/invite', L('重置邀请码', 'Reset invite'), L('旧码失效。仅 owner。', 'Invalidates the old code. Owner only.'), 'user', {
    responseJson: ok(`{ "invite_code": "ZX98YT76" }`),
  }),
  ep('team', 'api-team-join', 'POST', '/user/team/join', L('加入团队', 'Join team'), L('一人只能进一个团队。', 'A user can join only one team.'), 'user', {
    body: [f('code', 'string', 'body', '邀请码', 'Invite code', true)],
    requestExample: '{"code":"AB12CD34"}',
    responseJson: ok(`{ "id": 3, "role": "member" }`),
  }),
  ep('team', 'api-team-usage', 'GET', '/user/team/usage', L('团队用量', 'Team usage'), L('并发、存储、本月积分。非团队版返回失败。个人额度卡片走 GET /user/usage。', 'Concurrency, storage, monthly credits. Fails without a team plan. Personal usage is GET /user/usage.'), 'user', {
    responseJson: ok(`{ "members": [{ "user_id": 1, "nickname": "demo", "points_30d": 900 }], "pool_balance": 40000, "concurrent": { "used": 1, "limit": 4 }, "storage": { "used_bytes": 120000000, "limit_bytes": 21474836480 } }`),
  }),
]

const media: ApiEndpoint[] = [
  ep('media', 'api-media-actions', 'GET', '/user/media/actions', L('媒体动作', 'Media actions'), L('动作清单与可用性。前端工具条据此驱动。engine=local 免费；engine=model 走生成任务计费。', 'Action catalog and availability. The toolbar is driven by this. engine=local is free; engine=model bills a generation task.'), 'user', {
    responseJson: ok(`{ "items": [{ "action": "crop", "engine": "local", "available": true }, { "action": "upscale", "engine": "model", "available": true }] }`),
  }),
  ep('media', 'api-media-create', 'POST', '/user/media/jobs', L('创建媒体作业', 'Create media job'), L('asset_id 与 task_id 二选一。创建限流 30 次/分钟。status：0 排队 / 1 处理中 / 2 成功 / -1 失败。', 'asset_id or task_id. Rate limit 30/min. status: 0 queued / 1 running / 2 ok / -1 failed.'), 'user', {
    headers: headersFor('user', true, [hdrTeam]),
    body: [
      f('action', 'string', 'body', 'crop / remove_silence / upscale / …', 'crop / remove_silence / upscale / …', true),
      f('asset_id', 'integer', 'body', '源资产', 'Source asset'),
      f('task_id', 'integer', 'body', '源任务，取其产物', 'Source task; uses its output'),
      f('params', 'object', 'body', '动作参数，如 crop.rect', 'Action params, e.g. crop.rect'),
      f('node_id', 'string', 'body', '回填节点', 'Node to write back'),
      f('canvas_id', 'integer', 'body', '画布', 'Canvas'),
      f('project_id', 'integer', 'body', '项目', 'Project'),
    ],
    requestExample: '{"action":"crop","asset_id":123,"params":{"rect":{"x":0,"y":0.8,"w":1,"h":0.2}},"canvas_id":12}',
    responseJson: ok(`{ "job": { "id": 8, "engine": "local", "action": "crop", "status": 0, "progress": 0, "source_asset_id": 123, "outputs": [] } }`),
    errors: [errParam, errCredits, errModel],
  }),
  ep('media', 'api-media-job', 'GET', '/user/media/jobs/:id', L('作业详情', 'Get media job'), L('模型动作的状态由生成任务实时映射。取消模型动作走 POST /user/task/:id/cancel。', 'Model-engine status mirrors the generation task. Cancel via POST /user/task/:id/cancel.'), 'user', {
    params: [idPath],
    responseJson: ok(`{ "id": 8, "status": 2, "progress": 100, "outputs": [{ "asset_id": 130, "url": "https://cdn.example/out.mp4" }] }`),
    errors: [errGone],
  }),
]

const pub: ApiEndpoint[] = [
  ep('public', 'api-public-feed', 'GET', '/work', L('作品信息流', 'Work feed'), L('只返回 status=1。排序 featured desc, sort_order asc, published_at desc。带登录态时附 liked。', 'status=1 only. Sort featured desc, sort_order asc, published_at desc. Authed calls include liked.'), 'none', {
    headers: [],
    params: [
      f('keyword', 'string', 'query', '标题', 'Title'),
      f('category', 'string', 'query', '分类', 'Category'),
      f('featured', 'integer', 'query', '1 只取精选', '1 = featured only', false, '1'),
      f('user_id', 'integer', 'query', '某作者', 'Author id'),
      page, pageSize,
    ],
    responseJson: ok(`{ "items": [{ "id": 21, "title": "赛博夜雨", "author": { "id": 1, "nickname": "demo" }, "featured": 1 }], "total": 1 }`),
  }),
  ep('public', 'api-public-work', 'GET', '/work/:id', L('作品详情', 'Work detail'), L('浏览数 +1。', 'Increments view_count.'), 'none', {
    headers: [],
    params: [idPath],
    responseJson: ok(`{ "id": 21, "title": "赛博夜雨", "video_url": "https://cdn.example/film.mp4", "view_count": 120 }`),
    errors: [errGone],
  }),
  ep('public', 'api-public-process', 'GET', '/work/:id/process', L('制作过程', 'Work process'), L('作者关了 show_process 或没带 canvas_id 时不可看。返回节点与连线，供播放页只读展示。', 'Hidden when show_process is off or canvas_id is missing. Returns nodes and edges for a read-only player view.'), 'none', {
    headers: [],
    params: [idPath],
    responseJson: ok(`{ "nodes": [{ "kind": "video", "label": "镜头 1", "prompt": "夜雨" }], "edges": [] }`),
  }),
  ep('public', 'api-public-comments', 'GET', '/work/:id/comments', L('评论列表', 'Comments'), L('一级评论分页（最新在前），每条附最多 3 条回复。全部回复：GET /comment/:id/replies。', 'Top-level comments, newest first, each with up to 3 replies. All replies: GET /comment/:id/replies.'), 'none', {
    headers: [],
    params: [idPath, page, pageSize],
    responseJson: ok(`{ "items": [{ "id": 55, "content": "这一镜光很好", "replies": [], "author": { "id": 1, "nickname": "demo" } }], "total": 1 }`),
  }),
  ep('public', 'api-public-skill', 'GET', '/skill', L('官方技能', 'Official skills'), L('仅已上架。带登录态附 favorited。详情 GET /skill/:id 会把 uses +1。', 'Listed only. Authed calls include favorited. GET /skill/:id increments uses.'), 'none', {
    headers: [],
    params: [f('category', 'string', 'query', '分类', 'Category'), f('keyword', 'string', 'query', '名称', 'Name')],
    responseJson: ok(`{ "items": [{ "id": 1, "title": "一句话成片", "graph_nodes": 8 }] }`),
  }),
  ep('public', 'api-public-share', 'GET', '/share/canvas/:token', L('分享画布', 'Shared canvas'), L('匿名只读。graph 去掉任务状态和资产 ID，保留节点内容、提示词、媒体地址。', 'Anonymous read-only. graph drops task state and asset ids, keeps content, prompts and media URLs.'), 'none', {
    headers: [],
    params: [f('token', 'string', 'path', '分享 token', 'Share token', true)],
    responseJson: ok(`{ "name": "未命名草稿", "node_count": 6, "updated_at": 1730000000, "owner": { "id": 1, "nickname": "demo" }, "graph": {}, "mine": false }`),
  }),
]

const adminUser: ApiEndpoint[] = [
  ep('admin-user', 'api-admin-user-list', 'GET', '/admin/user', L('用户列表', 'Admin users'), L('缺省不含软删。deleted=1 查已注销账号。', 'Soft-deleted users omitted unless deleted=1.'), 'admin', {
    params: [
      f('keyword', 'string', 'query', '昵称 / 邮箱 / 手机', 'Nickname / email / mobile'),
      f('status', 'integer', 'query', '启用 / 禁用', 'Enabled / disabled'),
      f('deleted', 'integer', 'query', '1 查已注销', '1 = include deactivated'),
      page, pageSize,
    ],
    responseJson: ok(`{ "items": [{ "id": 1, "username": "demo@easytv.ai", "nickname": "demo", "role": 1, "status": 1 }], "total": 1 }`),
  }),
  ep('admin-user', 'api-admin-user-status', 'PUT', '/admin/user/:id/status', L('启用禁用', 'Enable / disable'), L('{ status: 1 | 2 }。', '{ status: 1 | 2 }.'), 'admin', {
    params: [idPath],
    body: [f('status', 'integer', 'body', '1 启用 / 2 禁用', '1 enable / 2 disable', true)],
    requestExample: '{"status":2}',
    responseJson: ok('null'),
  }),
  ep('admin-user', 'api-admin-user-identity', 'PUT', '/admin/user/:id/identity', L('运营身份', 'Identity'), L('easytv_official / enterprise / easytv_teacher / easytv_teaching_assistant。空或 __none__ 去掉。普通管理员不能改管理员账号。', 'easytv_official / enterprise / easytv_teacher / easytv_teaching_assistant. Empty or __none__ clears it. Regular admins cannot edit admin accounts.'), 'admin', {
    params: [idPath],
    body: [f('identity', 'string', 'body', '身份标识', 'Identity key', true)],
    requestExample: '{"identity":"easytv_official"}',
    responseJson: ok('null'),
  }),
  ep('admin-user', 'api-admin-console-access', 'POST', '/admin/user/:id/console_access', L('代登控制台', 'Console access'), L('返回一次性 ticket。创作台打开 STUDIO_URL + path；渠道后台打开 PARTNER_URL + /console?ticket=。不更新该用户最近登录时间。', 'One-time ticket. Studio: STUDIO_URL + path. Partner: PARTNER_URL + /console?ticket=. Does not bump last_login_at.'), 'admin', {
    params: [idPath],
    responseJson: ok(`{ "ticket": "t_xxx", "path": "/auth/ticket?t=t_xxx", "expires_in": 120 }`),
  }),
  ep('admin-user', 'api-admin-user-delete', 'DELETE', '/admin/user/:id', L('注销用户', 'Deactivate user'), L('软删。不可删管理员。RootAuth。', 'Soft delete. Admins cannot be removed. RootAuth.'), 'root', {
    params: [idPath],
    responseJson: ok('null'),
    errors: [errPerm],
  }),
]

const adminReview: ApiEndpoint[] = [
  ep('admin-review', 'api-admin-review-work', 'PUT', '/admin/work/:id/review', L('作品审核', 'Review work'), L('status 1 通过 / 2 驳回。驳回后作品 status=-1；通过会恢复被驳回的作品。', '1 approve / 2 reject. Reject sets work status=-1; approve restores a rejected work.'), 'admin', {
    params: [idPath],
    body: [
      f('status', 'integer', 'body', '1 通过 / 2 驳回', '1 approve / 2 reject', true),
      f('remark', 'string', 'body', '备注', 'Note'),
    ],
    requestExample: '{"status":1}',
    responseJson: ok('null'),
  }),
  ep('admin-review', 'api-admin-report', 'PUT', '/admin/work-report/:id/status', L('处理举报', 'Handle report'), L('1 成立 / 2 驳回。作品举报成立即下架；评论举报成立即隐藏评论。', '1 upheld / 2 dismissed. Upheld work reports unpublish; comment reports hide the comment.'), 'admin', {
    params: [idPath],
    body: [
      f('status', 'integer', 'body', '1 成立 / 2 驳回', '1 upheld / 2 dismissed', true),
      f('remark', 'string', 'body', '备注', 'Note'),
    ],
    requestExample: '{"status":1,"remark":"侵权成立"}',
    responseJson: ok('null'),
  }),
  ep('admin-review', 'api-admin-comment', 'PUT', '/admin/comment/:id/status', L('评论显隐', 'Comment visibility'), L('1 恢复 / 2 隐藏。隐藏时通知评论人。DELETE 删一级评论会连带回复。', '1 restore / 2 hide. Hide notifies the author. DELETE on a top-level comment removes replies.'), 'admin', {
    params: [idPath],
    body: [
      f('status', 'integer', 'body', '1 恢复 / 2 隐藏', '1 restore / 2 hide', true),
      f('remark', 'string', 'body', '备注', 'Note'),
    ],
    requestExample: '{"status":2}',
    responseJson: ok('null'),
  }),
  ep('admin-review', 'api-admin-featured', 'PUT', '/admin/work/:id', L('精选成片', 'Feature work'), L('编辑标题、分类、封面、featured、sort_order。featured=1 在信息流置顶。', 'Edit title, category, cover, featured, sort_order. featured=1 pins the feed.'), 'admin', {
    params: [idPath],
    body: [
      f('title', 'string', 'body', '标题', 'Title'),
      f('featured', 'integer', 'body', '0 / 1', '0 / 1'),
      f('sort_order', 'integer', 'body', '越小越前', 'Lower sorts first'),
    ],
    requestExample: '{"featured":1,"sort_order":10}',
    responseJson: ok('null'),
  }),
]

const adminPrice: ApiEndpoint[] = [
  ep('admin-price', 'api-admin-model-price', 'GET', '/admin/model-price', L('模型定价列表', 'Model prices'), L('model 必须与网关标识一致，这是 GET /generation/models 的唯一数据源。', 'model must match the gateway id. This is the only source for GET /generation/models.'), 'admin', {
    params: [
      page, pageSize,
      f('sort_by', 'string', 'query', 'model / type / unit / points_per_unit', 'model / type / unit / points_per_unit'),
      f('order', 'string', 'query', 'asc / desc', 'asc / desc'),
    ],
    responseJson: ok(`{ "items": [{ "id": 4, "model": "Kling-2.5", "type": "video", "unit": "second", "points_per_unit": 30, "status": 1 }], "total": 1 }`),
  }),
  ep('admin-price', 'api-admin-gateway-config', 'PUT', '/admin/gateway/config', L('网关配置', 'Gateway config'), L('地址、令牌、汇率、毛利。热更新，不必重启 API。GET 同路径读取。', 'URL, key, FX, margin. Hot reload — no API restart. GET the same path to read.'), 'root', {
    body: [
      f('base_url', 'string', 'body', '网关地址', 'Gateway URL'),
      f('api_key', 'string', 'body', '令牌', 'API key'),
      f('enabled', 'boolean', 'body', '是否启用', 'Enabled'),
    ],
    requestExample: '{"base_url":"https://api.newapi.pro","enabled":true}',
    responseJson: ok('null'),
    errors: [errPerm],
  }),
  ep('admin-price', 'api-admin-fetch-models', 'GET', '/admin/gateway/fetch-models', L('拉取网关模型', 'Fetch gateway models'), L('从网关拉模型与建议积分（美元成本 × 汇率 × 毛利 × 积分/元）。', 'Pull models and suggested credits (USD × FX × margin × credits/CNY).'), 'admin', {
    responseJson: ok(`{ "items": [{ "model": "Kling-2.5", "type": "video", "suggest_points": 30 }] }`),
  }),
  ep('admin-price', 'api-admin-import-models', 'POST', '/admin/gateway/models/import', L('导入模型定价', 'Import models'), L('写入 model_price 并定价。已有值默认不覆盖。', 'Writes model_price. Existing rows are not overwritten by default.'), 'root', {
    body: [f('models', 'array', 'body', '要导入的模型列表', 'Models to import', true)],
    requestExample: '{"models":[{"model":"Kling-2.5","type":"video","unit":"second","points_per_unit":30}]}',
    responseJson: ok(`{ "created": 3, "updated": 1 }`),
    errors: [errPerm],
  }),
  ep('admin-price', 'api-admin-refund', 'POST', '/admin/order/:id/refund', L('订单退款', 'Refund order'), L('先走原支付渠道全额退款，再回收未消耗积分、终止来源会员。manual 订单不调渠道。RootAuth。', 'Full refund on the original channel, then revoke unused credits and end sourced membership. manual orders skip the channel. RootAuth.'), 'root', {
    params: [idPath],
    body: [f('reason', 'string', 'body', '退款原因', 'Reason', true)],
    requestExample: '{"reason":"测试单"}',
    responseJson: ok(`{ "revoked_points": 3000, "refund_no": "R20261105001", "channel": "wechat" }`),
    errors: [errPerm],
  }),
  ep('admin-price', 'api-admin-adjust', 'POST', '/admin/wallet/:user_id/adjust', L('调整积分', 'Adjust credits'), L('正数新增批次，负数按最早过期扣减。RootAuth。', 'Positive adds a lot; negative spends oldest-expiry first. RootAuth.'), 'root', {
    params: [f('user_id', 'integer', 'path', '用户 id', 'User id', true)],
    body: [
      f('delta', 'integer', 'body', '正加负扣', 'Signed delta', true),
      f('reason', 'string', 'body', '原因', 'Reason', true),
      f('valid_days', 'integer', 'body', '新批次有效天数', 'Lot lifetime in days'),
    ],
    requestExample: '{"delta":500,"reason":"补偿","valid_days":365}',
    responseJson: ok('null'),
    errors: [errPerm],
  }),
]

const partner: ApiEndpoint[] = [
  ep('partner', 'api-partner-apply', 'POST', '/user/partner/apply', L('申请成为伙伴', 'Apply as partner'), L('已申请过返回当前状态。和创作台同一套登录。', 'Re-applying returns the current status. Same login as the studio.'), 'user', {
    body: [
      f('name', 'string', 'body', '渠道名', 'Partner name', true),
      f('kind', 'string', 'body', '类型', 'Kind', true),
      f('contact', 'string', 'body', '联系方式', 'Contact', true),
      f('intro', 'string', 'body', '介绍', 'Intro'),
    ],
    requestExample: '{"name":"星火渠道","kind":"mcn","contact":"13800138000","intro":""}',
    responseJson: ok(`{ "id": 2, "status": "pending" }`),
  }),
  ep('partner', 'api-partner-overview', 'GET', '/user/partner/console/overview', L('渠道看板', 'Partner overview'), L('未申请：success=false, code=not_applied。待审 / 驳回 / 停用仍返回 partner，前端按 status 展示状态页。', 'Not applied: success=false, code=not_applied. Pending / rejected / disabled still return partner; the UI keys off status.'), 'user', {
    responseJson: ok(`{ "partner": { "id": 2, "status": "approved", "name": "星火渠道" }, "customers": 12, "rebate": 240, "month": { "new_customers": 2, "orders": 1, "amount": 199, "rebate": 29.85 } }`),
    errors: [{ message: 'not_applied', desc: L('还没申请过渠道', 'Has not applied') }],
  }),
  ep('partner', 'api-partner-stats', 'GET', '/user/partner/console/stats', L('渠道趋势', 'Partner stats'), L('range=7d|30d|90d。日趋势含今天，缺日期补 0。amount 客户实付、rebate 返佣，人民币元。', 'range=7d|30d|90d. Daily series includes today; missing days are 0. amount is paid CNY, rebate is commission CNY.'), 'user', {
    params: [f('range', 'string', 'query', '7d / 30d / 90d', '7d / 30d / 90d', false, '30d')],
    responseJson: ok(`{ "rows": [{ "date": "2026-11-05", "new_customers": 2, "orders": 1, "amount": 199, "rebate": 29.85 }], "totals": { "new_customers": 12, "orders": 8, "amount": 1600, "rebate": 240 } }`),
  }),
  ep('partner', 'api-partner-customers', 'GET', '/user/partner/console/customers', L('渠道客户', 'Partner customers'), L('昵称脱敏，不含手机号 / 邮箱 / 订单明细。未通过返回 code=not_approved。', 'Nicknames are masked; no mobile / email / order lines. Not approved returns code=not_approved.'), 'user', {
    params: [
      f('paid', 'integer', 'query', '1 已付 / 0 未付', '1 paid / 0 unpaid'),
      f('sort', 'string', 'query', 'recent / amount', 'recent / amount'),
      page, pageSize,
    ],
    responseJson: ok(`{ "items": [{ "user_id": 9, "nickname": "张*", "paid": true, "amount": 199 }], "total": 1 }`),
  }),
  ep('partner', 'api-partner-landing', 'GET', '/partner/:code', L('渠道落地页', 'Partner landing'), L('公开。无效时 success=false。', 'Public. Invalid codes return success=false.'), 'none', {
    headers: [],
    params: [f('code', 'string', 'path', '渠道码', 'Partner code', true)],
    responseJson: ok(`{ "name": "星火渠道", "intro": "", "valid": true }`),
  }),
]

export const API_GROUPS: ApiGroup[] = [
  { id: 'auth', slug: 'api-auth', title: L('鉴权与登录', 'Auth'), summary: L('Bearer + EasyTV-User，邮箱 / 短信登录。', 'Bearer + EasyTV-User, email / SMS login.'), endpoints: auth },
  { id: 'user', slug: 'api-user', title: L('用户', 'User'), summary: L('资料、绑手机、注销、通知。', 'Profile, mobile, deactivate, notifications.'), endpoints: user },
  { id: 'project', slug: 'api-project', title: L('项目', 'Projects'), summary: L('作品容器，画布挂在项目下。', 'Film containers; canvases hang off a project.'), endpoints: project },
  { id: 'canvas', slug: 'api-canvas', title: L('画布', 'Canvas'), summary: L('graph、乐观锁、版本、分享、对话。', 'graph, optimistic lock, versions, share, chat.'), endpoints: canvas },
  { id: 'asset', slug: 'api-asset', title: L('资产', 'Assets'), summary: L('上传、导入、回收站。', 'Upload, import, trash.'), endpoints: asset },
  { id: 'task', slug: 'api-task', title: L('生成任务', 'Tasks'), summary: L('创建、轮询、取消、重试。', 'Create, poll, cancel, retry.'), endpoints: task },
  { id: 'models', slug: 'api-models', title: L('模型', 'Models'), summary: L('可用清单和详情，创建任务的白名单。', 'Live catalog — the create-task whitelist.'), endpoints: models },
  { id: 'work', slug: 'api-work', title: L('作品', 'Works'), summary: L('发布、点赞、评论、举报。', 'Publish, like, comment, report.'), endpoints: work },
  { id: 'skill', slug: 'api-skill', title: L('技能', 'Skills'), summary: L('私有 Skill 与收藏。', 'Private skills and favorites.'), endpoints: skill },
  { id: 'wallet', slug: 'api-wallet', title: L('钱包', 'Wallet'), summary: L('余额、批次、流水、会员。', 'Balance, lots, ledger, membership.'), endpoints: wallet },
  { id: 'order', slug: 'api-order', title: L('订单与支付', 'Orders'), summary: L('报价、下单、微信 / 支付宝。', 'Quote, place, WeChat / Alipay.'), endpoints: order },
  { id: 'team', slug: 'api-team', title: L('团队', 'Team'), summary: L('空间、邀请、用量。', 'Space, invite, usage.'), endpoints: team },
  { id: 'media', slug: 'api-media', title: L('媒体工具', 'Media'), summary: L('本地 ffmpeg 与模型动作。', 'Local ffmpeg and model actions.'), endpoints: media },
  { id: 'public', slug: 'api-public', title: L('公开接口', 'Public'), summary: L('信息流、技能、分享画布。', 'Feed, skills, shared canvas.'), endpoints: pub },
  { id: 'admin', slug: 'api-admin', title: L('管理侧', 'Admin'), summary: L('role ≥ 10；退款调账要 role ≥ 100。', 'role ≥ 10; refunds and credit adjustments need role ≥ 100.'), endpoints: [] },
  { id: 'admin-user', slug: 'api-admin-user', title: L('管理 · 用户', 'Admin · Users'), summary: L('列表、启用、身份、代登、注销。', 'List, enable, identity, impersonate, deactivate.'), endpoints: adminUser },
  { id: 'admin-review', slug: 'api-admin-review', title: L('管理 · 审核', 'Admin · Review'), summary: L('作品、举报、评论、精选。', 'Works, reports, comments, featured.'), endpoints: adminReview },
  { id: 'admin-price', slug: 'api-admin-price', title: L('管理 · 定价', 'Admin · Pricing'), summary: L('模型定价、网关、退款、调账。', 'Prices, gateway, refunds, adjustments.'), endpoints: adminPrice },
  { id: 'partner', slug: 'api-partner', title: L('渠道', 'Partner'), summary: L('申请、看板、客户、落地页。', 'Apply, dashboard, customers, landing.'), endpoints: partner },
]

export function allApiEndpoints(): ApiEndpoint[] {
  return [...API_TOP_LEVEL, ...API_GROUPS.flatMap(g => g.endpoints)]
}

export function findApiEndpoint(slug: string) {
  return allApiEndpoints().find(e => e.slug === slug) || null
}

export function findApiGroup(slug: string) {
  return API_GROUPS.find(g => g.slug === slug || g.endpoints.some(e => e.slug === slug)) || null
}

export function groupEntrySlug(g: ApiGroup) {
  return g.endpoints[0]?.slug || g.slug
}

export function apiGroupRedirects() {
  return API_GROUPS.filter(g => g.endpoints.length).flatMap((g) => {
    const to = `/docs/${groupEntrySlug(g)}`
    return [
      { from: `/docs/${g.slug}`, to },
      { from: `/en/docs/${g.slug}`, to: `/en${to}` },
    ]
  })
}

export function apiNavPages(): { slug: string; section: 'api' }[] {
  const pages: { slug: string; section: 'api' }[] = [{ slug: 'api', section: 'api' }]
  for (const e of API_TOP_LEVEL) pages.push({ slug: e.slug, section: 'api' })
  for (const g of API_GROUPS) {
    if (!g.endpoints.length) pages.push({ slug: g.slug, section: 'api' })
    for (const e of g.endpoints) pages.push({ slug: e.slug, section: 'api' })
  }
  return pages
}

export function buildCurl(ep: ApiEndpoint) {
  if (ep.curl) return ep.curl
  const path = ep.path
    .replace(':id', '12')
    .replace(':vid', '3')
    .replace(':sid', '7')
    .replace(':uid', '4')
    .replace(':user_id', '1')
    .replace(':token', 'share_xxx')
    .replace(':code', 'AB12')
    .replace(':key', 'SiteName')
  const query = (ep.params || [])
    .filter(p => p.loc === 'query' && p.example)
    .map(p => `${p.name}=${encodeURIComponent(p.example!)}`)
    .join('&')
  const url = query ? `$API${path}?${query}` : `$API${path}`
  const lines: string[] = [ep.method === 'GET' ? `curl "${url}"` : `curl -X ${ep.method} "${url}"`]
  for (const h of ep.headers) {
    const val = h.name === 'Authorization'
      ? 'Bearer $TOKEN'
      : h.name === 'EasyTV-User'
        ? '$UID'
        : h.name === 'EasyTV-Team'
          ? '$TEAM_ID'
          : h.name === 'Content-Type'
            ? (ep.contentType || 'application/json')
            : h.name === 'Accept-Language'
              ? 'zh-CN'
              : 'value'
    lines.push(`  -H "${h.name}: ${val}"`)
  }
  if (ep.requestExample && ep.contentType !== 'multipart/form-data')
    lines.push(`  -d '${ep.requestExample}'`)
  if (lines.length === 1) return lines[0]
  return `${lines[0]} \\\n${lines.slice(1).join(' \\\n')}`
}

export interface EndpointMdLabels {
  auth: string
  headers: string
  query: string
  path: string
  body: string
  errors: string
  curl: string
  response: string
  name: string
  type: string
  required: string
  desc: string
  yes: string
  no: string
}

function mdEscapeCell(text: string) {
  return text.replace(/\|/g, '\\|').replace(/\n+/g, ' ')
}

function mdFieldTable(fields: ApiField[], locale: string, labels: EndpointMdLabels) {
  const rows = fields.map((field) => {
    const req = field.required ? labels.yes : labels.no
    const extra = field.example ? ` \`${field.example}\`` : ''
    return `| \`${mdEscapeCell(field.name)}\` | \`${mdEscapeCell(field.type)}\` | ${req} | ${mdEscapeCell(pick(field.desc, locale))}${extra} |`
  })
  return `| ${labels.name} | ${labels.type} | ${labels.required} | ${labels.desc} |\n| --- | --- | --- | --- |\n${rows.join('\n')}`
}

export function buildEndpointMarkdown(ep: ApiEndpoint, locale: string, labels: EndpointMdLabels) {
  const lines: string[] = [
    `# ${pick(ep.title, locale)}`,
    '',
    `\`${ep.method}\` \`${ep.path}\` · ${labels.auth}`,
    '',
    pick(ep.summary, locale),
  ]
  const headers = (ep.headers || []).filter(f => f.loc === 'header')
  const pathParams = (ep.params || []).filter(f => f.loc === 'path')
  const query = (ep.params || []).filter(f => f.loc === 'query')
  const body = ep.body || []
  if (headers.length) {
    lines.push('', `## ${labels.headers}`, '', mdFieldTable(headers, locale, labels))
  }
  if (pathParams.length) {
    lines.push('', `## ${labels.path}`, '', mdFieldTable(pathParams, locale, labels))
  }
  if (query.length) {
    lines.push('', `## ${labels.query}`, '', mdFieldTable(query, locale, labels))
  }
  if (body.length) {
    lines.push('', `## ${labels.body}`, '')
    if (ep.contentType) lines.push(ep.contentType, '')
    lines.push(mdFieldTable(body, locale, labels))
  }
  lines.push('', `## ${labels.curl}`, '', '```bash', buildCurl(ep), '```')
  lines.push('', `## ${labels.response}`, '', '```json', ep.responseJson.trim(), '```')
  if (ep.responseNote) lines.push('', pick(ep.responseNote, locale))
  if (ep.errors?.length) {
    lines.push('', `## ${labels.errors}`, '')
    for (const err of ep.errors) {
      lines.push(`- **${err.message}** — ${pick(err.desc, locale)}`)
    }
  }
  return `${lines.join('\n').trim()}\n`
}

export function pageTitle(slug: string, locale: string) {
  if (slug === 'api-healthz') return pick(API_TOP_LEVEL[0].title, locale)
  const ep = findApiEndpoint(slug)
  if (ep) return pick(ep.title, locale)
  const g = API_GROUPS.find(x => x.slug === slug)
  if (g) return pick(g.title, locale)
  return ''
}

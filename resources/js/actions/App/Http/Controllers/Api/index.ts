import AuthController from './AuthController'
import TicketController from './TicketController'
import CommentController from './CommentController'
import CategoryController from './CategoryController'
import UserController from './UserController'
import NotificationController from './NotificationController'
import ResponseTemplateController from './ResponseTemplateController'
import ReportController from './ReportController'
const Api = {
    AuthController: Object.assign(AuthController, AuthController),
TicketController: Object.assign(TicketController, TicketController),
CommentController: Object.assign(CommentController, CommentController),
CategoryController: Object.assign(CategoryController, CategoryController),
UserController: Object.assign(UserController, UserController),
NotificationController: Object.assign(NotificationController, NotificationController),
ResponseTemplateController: Object.assign(ResponseTemplateController, ResponseTemplateController),
ReportController: Object.assign(ReportController, ReportController),
}

export default Api
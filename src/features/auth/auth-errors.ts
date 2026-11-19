// Dịch lỗi xác thực của Supabase sang câu thông báo tiếng Việt dễ hiểu, kể cả khi máy chủ tài khoản chưa được cấu hình
const MESSAGES: Record<string, string> = {
  invalid_credentials: 'Email hoặc mật khẩu không đúng.',
  user_already_exists: 'Email này đã có tài khoản, hãy đăng nhập.',
  email_exists: 'Email này đã có tài khoản, hãy đăng nhập.',
  email_not_confirmed: 'Bạn cần bấm link xác nhận trong email trước khi đăng nhập.',
  weak_password: 'Mật khẩu quá yếu, hãy dùng ít nhất 8 ký tự gồm chữ và số.',
  over_email_send_rate_limit: 'Bạn thao tác quá nhanh, hãy đợi vài phút rồi thử lại.',
  over_request_rate_limit: 'Bạn thao tác quá nhanh, hãy đợi vài phút rồi thử lại.',
  same_password: 'Mật khẩu mới phải khác mật khẩu cũ.',
  validation_failed: 'Thông tin chưa hợp lệ, vui lòng kiểm tra lại.',
  email_address_invalid: 'Địa chỉ email không hợp lệ, vui lòng kiểm tra lại.',
  email_address_not_authorized: 'Hệ thống chưa gửi được email tới địa chỉ này, vui lòng thử lại sau.',
  otp_expired: 'Link trong email đã hết hạn, hãy yêu cầu gửi lại.',
  signup_disabled: 'Hiện chưa mở đăng ký tài khoản mới.',
  provider_disabled: 'Cách đăng nhập này đang tạm tắt, bạn hãy dùng email và mật khẩu.',
  anonymous_provider_disabled: 'Mua nhanh không cần tài khoản đang tạm tắt, bạn hãy đăng nhập để tiếp tục.',
  user_banned: 'Tài khoản này đang bị tạm khoá.',
};

export function authErrorMessage(error: { code?: string; message?: string } | null) {
  if (!error) return '';
  return (error.code && MESSAGES[error.code]) || 'Không thực hiện được, vui lòng thử lại sau.';
}

export const BACKEND_MISSING_MESSAGE = 'Máy chủ tài khoản chưa được cấu hình nên tạm thời chưa đăng nhập được. Các game miễn phí vẫn chơi bình thường.';

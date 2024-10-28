using API.IServices;
using DataProcessing.Configurations;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;

namespace API.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;
        public EmailService(IOptions<SmtpSettings> options)
        {
            _smtpSettings = options.Value;
        }
        public async Task SendOtpEmailAsync(string toEmail, string otpCode)
        {
            if (string.IsNullOrEmpty(toEmail))
            {
                throw new ArgumentException("Email không được để trống.", nameof(toEmail));
            }
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_smtpSettings.SenderName, _smtpSettings.SenderEmail));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = "Mã xác nhận đổi mật khẩu";

            string htmlContent = $@"
            <!DOCTYPE html>
            <html lang='vi'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Mã Xác Nhận từ Cửa Hàng Meiko</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        width: 100%;
                        max-width: 600px;
                        margin: auto;
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }}
                    h1 {{
                        color: #333;
                    }}
                    .otp {{
                        font-size: 24px;
                        font-weight: bold;
                        color: #4CAF50;
                        margin: 20px 0;
                    }}
                    .footer {{
                        margin-top: 20px;
                        font-size: 12px;
                        color: #777;
                    }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <h1>Xin chào {toEmail},</h1>
                    <p>Chúng tôi đã nhận yêu cầu mã dùng một lần để sử dụng cho tài khoản Shop Meiko của bạn.</p>
                    <p>Mã dùng một lần của bạn là:</p>
                    <div class='otp'>{otpCode}</div>
                    <p>Thời hạn mã trong vòng 30 phút từ lúc gửi</p>
                    <p>Nếu không yêu cầu mã này thì bạn có thể bỏ qua email này một cách an toàn. Có thể ai đó khác đã nhập địa chỉ email của bạn do nhầm lẫn.</p>
                    <p>Xin cảm ơn,<br>Nhóm Cửa hàng bán giày Meiko</p>
                    <div class='footer'>
                        <p>Điều khoản về Quyền riêng tư: <a href='#'>Xem thêm</a></p>
                    </div>
                </div>
            </body>
            </html>
            ";

            message.Body = new TextPart("html")
            {
                Text = htmlContent
            };
            using var client = new SmtpClient();
            try
            {
                await client.ConnectAsync(_smtpSettings.Server, _smtpSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_smtpSettings.UserName, _smtpSettings.Password);
                await client.SendAsync(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi gửi email: {ex.Message}");
                throw;
            }
            finally
            {
                await client.DisconnectAsync(true);
            }
        }
    }
}

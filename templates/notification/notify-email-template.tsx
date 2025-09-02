export const NotifyEmailTemplate = ({
  reminderName,
}: {
  reminderName: string;
}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifoo Reminder - Time to Spring Into Action!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; line-height: 1.6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                Notifoo Alert! 
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #dbeafe; font-size: 16px; font-weight: 500;">
                                Your reminder sensei has arrived!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <div style="display: inline-block; background-color: #fef3c7; border: 2px dashed #f59e0b; border-radius: 12px; padding: 20px 30px; margin-bottom: 20px;">
                                    <h2 style="margin: 0 0 10px 0; color: #92400e; font-size: 20px; font-weight: 600;">
                                        ⏰ Ding, Ding—That’s the End of the Ring!
                                    </h2>
                                    <p style="margin: 0; color: #78350f; font-size: 18px; font-weight: 500; background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                                        ${reminderName}
                                    </p>
                                </div>
                            </div>
                            
                            <div style="text-align: center; margin-bottom: 30px;">
                                <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">
                                    <strong>Reminder Set:</strong> {{REMINDER_DATE}}
                                </p>
                                <p style="margin: 0; color: #6b7280; font-size: 14px; font-style: italic;">
                                    "A reminder a day keeps the forgetfulness away!" 🧠✨
                                </p>
                            </div>
                            
                            <!-- Action Button -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{APP_URL}}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3); transition: all 0.2s;">
                                    Set Another Reminder
                                </a>
                            </div>
                            
                            <!-- Fun Facts Section -->
                            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-top: 30px; border-left: 4px solid #3b82f6;">
                                <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                                    🎯 Notifoo Fun Fact:
                                </h3>
                                <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">
                                    You've now mastered another level in the ancient art of remembering! 
                                    Your memory foo is getting stronger. 💪
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px;">
                                Keep being awesome! 🌟
                            </p>
                            <p style="margin: 0 0 15px 0; color: #64748b; font-size: 12px;">
                                This reminder was delivered by your friendly neighborhood Notifoo ninjas.
                            </p>
                            <p style="margin: 15px 0 0 0; color: #94a3b8; font-size: 11px;">
                                © 2025 Notifoo. All rights reserved.<br>
                                Made with ❤️ and a lot of coffee ☕
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};

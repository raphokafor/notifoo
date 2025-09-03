export default function WelcomeEmailTemplate({ appUrl }: { appUrl: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Notifoo Dojo!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
         Header 
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to the Notifoo Dojo!</h1>
            <p style="color: #dbeafe; margin: 10px 0 0; font-size: 16px;">You've just earned your white belt in remembering stuff</p>
        </div>

        <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Congratulations, Memory Warrior! 🎉</h2>
            
            <p style="color: #475569; margin: 0 0 20px; font-size: 16px;">
                You've successfully joined the elite ranks of people who are tired of forgetting important stuff. Welcome to Notifoo, where your memory gets a digital sidekick that actually shows up when needed!
            </p>

            <div style="background-color: #f1f5f9; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #1e293b; margin: 0 0 10px; font-size: 18px; font-weight: 600;">Your Notification Ninja Training Begins Now:</h3>
                <ul style="color: #475569; margin: 10px 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;"><strong>Set Your First Reminder:</strong> Start small - maybe "Remember to celebrate joining Notifoo" 🎊</li>
                    <li style="margin-bottom: 8px;"><strong>Choose Your Weapon:</strong> SMS for urgent stuff, email for the less dramatic reminders</li>
                    <li style="margin-bottom: 8px;"><strong>Master the Art:</strong> The more you use it, the less you'll forget (it's like magic, but with more technology)</li>
                </ul>
            </div>

            <p style="color: #475569; margin: 20px 0; font-size: 16px;">
                Pro tip: Your brain might feel a little jealous that you've outsourced some of its job to us. Don't worry, we'll share the credit when you remember everything perfectly! 😉
            </p>

            <div style="text-align: center; margin: 40px 0;">
                <a href="${appUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">
                    Start My Reminder Journey
                </a>
            </div>

            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h4 style="color: #92400e; margin: 0 0 10px; font-size: 16px; font-weight: 600;">🏆 Fun Fact:</h4>
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                    You're now part of an exclusive club of people who've decided that forgetting things is so last century. Your membership card is this email (please don't forget where you put it).
                </p>
            </div>
        </div>

        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            
            <p style="color: #94a3b8; margin: 20px 0 0; font-size: 12px;">
                May your reminders be timely and your memory be legendary,<br>
                <strong>The Notification Ninjas at Notifoo</strong> 
            </p>
            
        </div>
    </div>
</body>
</html>
`;
}

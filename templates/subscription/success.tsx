export const SuccessSubscriptionTemplate = ({
  customerName,
  appUrl,
}: {
  customerName: string;
  appUrl: string;
}) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Memory Dojo!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                ACHIEVEMENT UNLOCKED!
            </h1>
            <p style="color: #e0f2fe; margin: 10px 0 0; font-size: 18px;">
                You've officially joined the Memory Warriors
            </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
            <!-- Achievement Badge -->
            <div style="background-color: #f1f5f9; border: 2px dashed #3b82f6; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
                <div style="font-size: 48px; margin-bottom: 10px;">🏅</div>
                <h3 style="color: #3b82f6; margin: 0 0 10px; font-size: 20px; font-weight: bold;">
                    Welcome to the Notifoo Dojo!
                </h3>
                <p style="color: #64748b; margin: 0; font-size: 14px;">
                    Congratulations ${customerName}! You've successfully subscribed and earned your place among the elite ranks of people who actually remember stuff.
                </p>
            </div>

            <!-- What's Next -->
            <div style="margin: 30px 0;">
                <h3 style="color: #1e293b; margin: 0 0 20px; font-size: 20px; font-weight: bold;">
                    Your Memory Training Begins Now:
                </h3>
                
                <div style="margin-bottom: 15px;">
                    <div style="display: inline-block; width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; font-weight: bold; margin-right: 12px; vertical-align: top;">1</div>
                    <span style="color: #64748b; font-size: 16px;">Set your first reminder and feel the power of organized living</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="display: inline-block; width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; font-weight: bold; margin-right: 12px; vertical-align: top;">2</div>
                    <span style="color: #64748b; font-size: 16px;">Watch in amazement as you actually remember to do things</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="display: inline-block; width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; font-weight: bold; margin-right: 12px; vertical-align: top;">3</div>
                    <span style="color: #64748b; font-size: 16px;">Become the person your past forgetful self always dreamed of being</span>
                </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 35px 0;">
                <a href=${appUrl} style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3); transition: all 0.2s;">
                    Enter the Memory Dojo 
                </a>
            </div>

            <!-- Fun Stats -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 500;">
                    <strong>Fun Fact:</strong> You're now 847% more likely to remember your anniversary, 23% less likely to show up to meetings empty-handed, and 100% more awesome at life management. These statistics are totally made up but feel accurate, right?
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <div style="margin-top: 20px;">
                <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                    © 2025 Notifoo - Your Memory's New Best Friend
                </p>
            </div>
        </div>
    </div>
</body>
</html>

    `;
};

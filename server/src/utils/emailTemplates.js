export function WelcomeEmail({ name, email }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Welcome to PetCare</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px;">🐾 Welcome to PetCare!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e1e1e1; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin-top: 0; color: #333;">Hi ${name || 'there'}! 👋</h2>
          
          <p style="font-size: 16px; color: #555;">
            Welcome to PetCare - your trusted marketplace for buying and selling pets! We're excited to have you join our community of pet lovers.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #667eea;">🎯 What you can do now:</h3>
            <ul style="color: #555; padding-left: 20px;">
              <li>Browse thousands of verified pet listings</li>
              <li>Connect with trusted sellers in your area</li>
              <li>List your own pets for adoption/sale</li>
              <li>Get AI-powered assistance for any questions</li>
              <li>Read reviews and make informed decisions</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://your-app.com/browse" style="background: #667eea; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Start Browsing Pets →
            </a>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>💡 Pro Tip:</strong> Complete your profile and verify your phone number to build trust with other users!
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 30px 0;">
          
          <p style="color: #777; font-size: 14px; margin-bottom: 5px;">
            Questions? Our AI assistant is available 24/7 to help!
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Best regards,<br>
            <strong>The PetCare Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} PetCare. All rights reserved.</p>
          <p>This email was sent to ${email}</p>
        </div>
      </body>
    </html>
  `;
}

export function NewRequestEmail({ petName, buyerName, petPrice }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Purchase Request</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 New Request Received!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e1e1e1; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; color: #555;">
            Hi! Someone is interested in your pet:
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #333;">🐾 ${petName}</h3>
            <p style="color: #666; margin: 10px 0;">
              <strong>Interested Buyer:</strong> ${buyerName}<br>
              <strong>Price:</strong> ₹${petPrice}
            </p>
          </div>
          
          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #2e7d32; font-size: 14px;">
              <strong>✅ Next Steps:</strong><br>
              1. Login to your PetCare dashboard<br>
              2. Review the request<br>
              3. Accept or reject the buyer<br>
              4. Chat with them after acceptance
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://your-app.com/dashboard" style="background: #f5576c; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Request in Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            Tip: Respond quickly to increase your chances of a successful sale!
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} PetCare. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}

export function RequestAcceptedEmail({ petName, sellerName }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Request Accepted!</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">✅ Request Accepted!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e1e1e1; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; color: #555;">
            Great news! The seller has accepted your request for:
          </p>
          
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #38ef7d;">
            <h3 style="margin-top: 0; color: #333;">🐾 ${petName}</h3>
            <p style="color: #666; margin: 10px 0;">
              <strong>Seller:</strong> ${sellerName}
            </p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>📱 What's Next:</strong><br>
              You can now chat with the seller to arrange meeting details, ask questions, and finalize the purchase!
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://your-app.com/chat" style="background: #38ef7d; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; color: #000;">
              Start Chatting Now →
            </a>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #667eea;">🛡️ Safety Reminder:</h4>
            <ul style="color: #555; padding-left: 20px; font-size: 14px;">
              <li>Meet in public places</li>
              <li>Bring a friend or family member</li>
              <li>Verify the pet's health before payment</li>
              <li>Never pay in advance without seeing the pet</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} PetCare. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}

export function ListingApprovedEmail({ listingTitle }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Listing Approved!</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">✅ Listing Approved!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e1e1e1; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; color: #555;">
            Your listing has been approved and is now live on PetCare!
          </p>
          
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #38ef7d;">
            <h3 style="margin-top: 0; color: #333;">🐾 ${listingTitle}</h3>
            <p style="color: #666; margin: 10px 0;">
              Your pet is now visible to thousands of potential buyers!
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://your-app.com/dashboard" style="background: #667eea; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Your Listing
            </a>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #667eea;">💡 Tips for Quick Sale:</h4>
            <ul style="color: #555; padding-left: 20px; font-size: 14px;">
              <li>Respond quickly to buyer requests</li>
              <li>Provide clear, honest information</li>
              <li>Be flexible with meeting times</li>
              <li>Keep your listing updated</li>
            </ul>
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
            Note: Listings automatically expire after 60 days. You can renew anytime!
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} PetCare. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}

export function NewMessageEmail({ senderName, petName, messagePreview }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Message</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">💬 New Message!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e1e1e1; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; color: #555;">
            You received a new message about:
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4facfe;">
            <h3 style="margin-top: 0; color: #333;">🐾 ${petName}</h3>
            <p style="color: #666; margin: 10px 0;">
              <strong>From:</strong> ${senderName}
            </p>
          </div>
          
          <div style="background: #fff; border: 1px solid #e1e1e1; padding: 15px; border-radius: 8px; margin: 20px 0; font-style: italic; color: #555;">
            "${messagePreview}"
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://your-app.com/chat" style="background: #4facfe; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Read Full Message →
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Tip: Quick responses lead to more successful transactions!
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} PetCare. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}

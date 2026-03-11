# 📧 Email Notifications - Setup Guide

## ✅ Email System Implemented!

Your PetCare app now sends **real emails** for:
- ✨ Welcome emails (when users sign up)
- 🎉 New purchase requests (to sellers)
- ✅ Request accepted (to buyers)
- 📧 New messages (to both parties)
- ✅ Listing approved (to sellers)

---

## 🔧 Setup Instructions (5 minutes)

### Step 1: Get Resend API Key

1. Go to https://resend.com
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with Google/GitHub (30 seconds)
4. Go to **API Keys** section (left sidebar)
5. Click **"Create API Key"**
6. Give it a name: "PetCare"
7. Copy the API key (starts with `re_`)

### Step 2: Add to .env

Open `/home/lokesh/pet_care/server/.env` and add:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

Replace `re_xxxxxxxxxxxxx` with your actual key.

### Step 3: Restart Server

```bash
cd /home/lokesh/pet_care/server
pkill -f "node src/index.js"
node src/index.js &
```

---

## 📧 Emails That Will Be Sent

| Trigger | Recipient | Subject |
|---------|-----------|---------|
| **New User Signup** | Buyer/Seller | 🐾 Welcome to PetCare! |
| **New Request** | Seller | 🎉 New Request for [Pet Name]! |
| **Request Accepted** | Buyer | ✅ Your request was accepted! |
| **New Message** | Other participant | 💬 New message about [Pet Name] |
| **Listing Approved** | Seller | ✅ Your listing is now live! |

---

## 🧪 Testing Emails

### Without API Key (Dev Mode):
Emails are **logged to console** - perfect for testing!

```
📧 [DEV MODE] Would send email to: user@example.com
📧 Subject: 🐾 Welcome to PetCare!
📧 HTML: <!DOCTYPE html>...
```

### With API Key (Production):
Emails are **sent to real inboxes**!

```
📧 Email sent successfully: { id: "email_id" }
```

---

## 🎨 Email Templates

All emails include:
- ✅ Beautiful gradient headers
- ✅ Mobile-responsive design
- ✅ Clear call-to-action buttons
- ✅ Professional branding
- ✅ Safety tips and guidance

---

## 📝 Notes

1. **Free Tier**: 3,000 emails/month (plenty for demo)
2. **From Address**: Uses Resend's test domain
3. **Custom Domain**: Can be added later (requires DNS setup)
4. **Dev Mode**: Works without API key (logs to console)

---

## 🚀 For Production Deployment

When you deploy, just add this environment variable:

**Vercel/Render/Railway:**
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

That's it! Emails will work automatically.

---

## 🎯 What's Configured

✅ Welcome email on signup
✅ New request notification to sellers
✅ Request acceptance notification to buyers  
✅ New message notifications
✅ Listing approval notifications
✅ Beautiful HTML templates
✅ Dev mode for testing
✅ Error handling

---

**Ready to test! Sign up a new account and check your email!** 📬

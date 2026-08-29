# Solana Invoice Hub

Build a polished, modern SaaS web application called **Payvolae**.

## Product Overview

Payvolae is a simple invoicing and crypto-payment platform for freelancers, creators, consultants, developers, and small businesses.

The core user flow is:

**Create Invoice → Share Payment Link/QR Code → Client Pays with SOL or USDC → Payment is Verified → Invoice Changes to PAID**

The product should feel like a serious fintech/SaaS product, not a cryptocurrency trading platform.

The primary goal of this UI is to make creating and tracking invoices extremely simple.

---

# DESIGN DIRECTION

Create a premium, clean and trustworthy interface inspired by modern SaaS products such as Stripe, Linear, Vercel, and modern fintech applications.

### Visual style

* Minimal
* Professional
* Modern
* Spacious
* Clean typography
* Subtle borders
* Soft shadows
* Rounded cards
* Excellent whitespace
* Desktop-first but fully responsive
* Light mode as the primary theme
* Optional dark mode support

Avoid:

* Excessive gradients
* Neon crypto aesthetics
* Overuse of purple
* Trading charts
* Meme-coin aesthetics
* Complicated blockchain terminology
* Cluttered dashboards

The product should look trustworthy enough for a freelancer to send an invoice to a real client.

Use Solana branding subtly rather than making the entire interface purple/green.

---

# APPLICATION STRUCTURE

Create the following main pages:

1. Landing Page
2. Sign In / Sign Up
3. Dashboard
4. Invoices
5. Create Invoice
6. Invoice Details
7. Public Payment Page
8. Payment Success Page
9. Settings
10. Wallet Connection modal

---

# 1. LANDING PAGE

Create a professional marketing landing page.

Hero section:

Headline:

**Get Paid. Simply. On Solana.**

Subheadline:

**Create professional invoices and receive fast, transparent payments in SOL or USDC.**

Primary CTA:

**Create Your First Invoice**

Secondary CTA:

**View Demo**

Hero visual:

Show a realistic invoice/payment dashboard preview.

Include a sample invoice card showing:

Invoice #INV-00124

Website Development

$500.00 USDC

Status: Awaiting Payment

Button:

**Pay Invoice**

Below the hero, add a simple explanation:

### How it works

Step 1:
**Create an invoice**
Add your client, service and amount.

Step 2:
**Share your payment link**
Send the invoice or QR code to your client.

Step 3:
**Get paid**
Your invoice automatically updates when payment is confirmed.

Add a feature section:

### Built for modern independent businesses

Feature cards:

* Professional invoices
* SOL & USDC payments
* Shareable payment links
* QR code payments
* On-chain payment verification
* Real-time payment status

Add a final CTA:

**Start sending invoices today**

---

# 2. AUTHENTICATION

Create clean Sign Up and Sign In pages.

Sign Up fields:

* Full name
* Email
* Password

Buttons:

**Create Account**

**Continue with Wallet**

Sign In:

* Email
* Password
* Remember me
* Forgot password

Button:

**Sign In**

Also provide:

**Connect Solana Wallet**

The wallet connection should initially be a UI interaction/mock flow. Structure the code so real Solana wallet integration can be added later.

---

# 3. DASHBOARD

Create a professional dashboard.

Sidebar navigation:

* Overview
* Invoices
* Create Invoice
* Payments
* Customers
* Settings

At the bottom of the sidebar:

**Wallet**

Connected wallet display:

`7xK...92Lm`

Status:

**Connected**

Main dashboard header:

**Good morning, Alex**

Subtitle:

**Here's what's happening with your invoices.**

Top-right:

**+ Create Invoice**

Dashboard statistics cards:

### Total Revenue

$8,420.00

+12.5%

### Outstanding

$2,150.00

### Paid Invoices

24

### Pending Invoices

5

Then create a section:

### Recent Invoices

Table columns:

* Invoice
* Client
* Amount
* Date
* Status
* Action

Example rows:

INV-00124 | Acme Design | $500 USDC | Aug 28, 2026 | Paid

INV-00123 | Sarah Johnson | $850 USDC | Aug 27, 2026 | Pending

INV-00122 | TechHub | $1,200 USDC | Aug 25, 2026 | Paid

INV-00121 | David Smith | $300 USDC | Aug 24, 2026 | Overdue

Status badges should be visually distinct but subtle.

Add a small revenue chart showing invoice revenue over the last 30 days.

---

# 4. INVOICES PAGE

Create an invoice management page.

Header:

**Invoices**

Subtitle:

**Create, manage and track your invoices.**

Primary button:

**+ Create Invoice**

Add search:

**Search invoices...**

Filters:

* All
* Paid
* Pending
* Overdue
* Draft

Invoice table:

* Invoice Number
* Client
* Description
* Amount
* Due Date
* Status
* Created
* Actions

Actions:

* View
* Copy Payment Link
* Download
* More

Allow clicking an invoice to open its details.

---

# 5. CREATE INVOICE PAGE

This is one of the most important screens.

Create a beautiful two-column invoice builder.

Left side:

### Create Invoice

Section:

**Client Information**

Fields:

* Client Name
* Client Email

Section:

**Invoice Details**

Fields:

* Invoice Number
* Issue Date
* Due Date

Section:

**Items**

Allow users to add invoice line items.

Each item has:

* Description
* Quantity
* Rate
* Amount

Example:

Website Design | 1 | $500 | $500

Button:

**+ Add Item**

Section:

**Payment Currency**

Selectable options:

**USDC**

**SOL**

Section:

**Notes**

Textarea:

"Thank you for your business."

Right side:

### Live Preview

Display a professional invoice preview.

Example:

SOLANAPAY

INVOICE

#INV-00124

From:

Alex Morgan

[alex@example.com](mailto:alex@example.com)

Bill To:

Acme Design

[client@example.com](mailto:client@example.com)

---

Website Development      $500.00

---

Total                    $500.00 USDC

Payment method:

Solana

At the bottom:

**[Create Invoice]**

After clicking Create Invoice, show a success state:

**Invoice Created**

Then display:

**Payment Link**

with a copy button.

Also display:

**QR Code**

and buttons:

**Share Invoice**

**View Invoice**

---

# 6. INVOICE DETAILS PAGE

Create a detailed invoice page.

Header:

**Invoice #INV-00124**

Status badge:

**PAID**

Buttons:

**Share**

**Download PDF**

**More**

Main invoice card should look like a real professional invoice.

Include:

From:

Alex Morgan

Bill To:

Acme Design

Invoice date

Due date

Line items

Subtotal

Network fee

Total

Payment currency

At the bottom include a payment timeline:

### Payment Activity

Invoice created

Aug 28, 2026

Payment detected

Aug 28, 2026

Payment confirmed

Aug 28, 2026

Add a blockchain transaction section:

**Transaction**

`5K8...F92`

Button:

**View on Solana Explorer**

For now this can use mock data, but structure it so it can later connect to a real Solana transaction.

---

# 7. PUBLIC PAYMENT PAGE

This is extremely important.

This is the page a freelancer sends to their client.

It should NOT look like an internal dashboard.

Create a clean centered payment experience.

Top:

**SOLANAPAY**

Main card:

### Invoice #INV-00124

From:

Alex Morgan

For:

Website Development

Amount Due:

# $500.00 USDC

Due:

September 10, 2026

Button:

**Pay with Solana**

Below:

**or scan to pay**

Display a large QR code.

Below QR code:

**Send exactly $500.00 USDC**

Wallet address:

`8h3K...92Lm`

Copy button.

Add trust information:

**Payments are verified on the Solana blockchain.**

When the user clicks Pay with Solana, open a wallet connection modal.

---

# 8. WALLET CONNECTION MODAL

Create a polished wallet selection modal.

Title:

**Connect your Solana wallet**

Subtitle:

**Connect a wallet to complete your payment.**

Wallet options:

* Phantom
* Solflare
* Backpack

Each should have an icon placeholder.

Include:

**Don't have a wallet?**

with a small explanatory link.

Initially this should be a frontend/mock interaction. Keep the architecture ready for real wallet adapters later.

---

# 9. PAYMENT PROCESSING STATE

After initiating payment, display a payment processing screen.

Animation/spinner.

Title:

**Confirming your payment**

Subtitle:

**We're waiting for the transaction to be confirmed on Solana.**

Show:

Amount:

$500 USDC

Status:

**Confirming...**

Transaction:

`5K8...F92`

After confirmation, transition to:

---

# 10. PAYMENT SUCCESS PAGE

Large success indicator.

Title:

**Payment successful**

Subtitle:

**Your payment of $500.00 USDC has been confirmed on Solana.**

Show:

Invoice:

INV-00124

Amount:

$500.00 USDC

Status:

**Paid**

Transaction:

`5K8...F92`

Button:

**View Transaction**

Button:

**Download Receipt**

---

# 11. SETTINGS PAGE

Create settings sections:

### Profile

* Full name
* Email
* Business name
* Business logo

### Wallet

Connected wallet

`7xK...92Lm`

Button:

**Disconnect**

### Payment Preferences

Default currency:

USDC

Accepted currencies:

* USDC
* SOL

### Invoice Preferences

Default payment terms

Invoice prefix

Business address

---

# 12. EMPTY STATES

Create polished empty states.

Invoices:

**No invoices yet**

"Create your first invoice and start getting paid."

Button:

**Create Invoice**

Payments:

**No payments yet**

"Payments will appear here once your invoices are paid."

---

# 13. RESPONSIVE DESIGN

The entire application must work well on:

* Desktop
* Tablet
* Mobile

On mobile:

* Convert sidebar to hamburger navigation
* Stack invoice builder columns
* Make tables horizontally scrollable or convert them into cards
* Make payment pages extremely simple and mobile-friendly
* Make QR codes easy to scan

---

# 14. COMPONENTS

Create reusable components for:

* Sidebar
* Header
* Buttons
* Cards
* Status badges
* Invoice table
* Invoice preview
* Invoice form
* Payment page
* Wallet modal
* QR code
* Transaction status
* Toast notifications
* Modal dialogs
* Empty states

Use consistent spacing, typography and component behavior throughout the application.

---

# 15. MOCK DATA

Since this is initially a UI prototype, use realistic mock data.

Do not leave the dashboard empty.

Populate the application with sample:

* invoices
* clients
* payments
* transactions
* revenue statistics

Make interactions functional within the frontend.

For example:

* Creating an invoice should add it to the invoice list.
* Copy buttons should actually copy data.
* Filters should work.
* Search should work.
* Invoice status should display correctly.
* The payment flow should move through the appropriate UI states.
* Wallet connection should have a realistic mock connected/disconnected state.

Use local state/local storage where appropriate so the prototype feels like a real application.

---

# 16. TECHNICAL DIRECTION

Build this as a modern React/TypeScript application.

Use a clean component architecture.

Use Tailwind CSS for styling.

Use a modern icon library such as Lucide.

Use accessible components and proper form validation.

Do not hardcode the entire application into one component.

Keep the code modular so backend and Solana functionality can be integrated later.

For now, blockchain transactions and wallet connections can use mock data/UI interactions.

However, structure the application so the following can later be replaced with real functionality:

* Solana wallet connection
* SOL payments
* USDC payments
* Transaction verification
* Solana Explorer links
* Backend invoice persistence

---

# 17. IMPORTANT PRODUCT PRINCIPLE

The application should feel like:

**Stripe for simple Solana invoices**

—not like a crypto exchange.

The user should immediately understand:

1. What they are owed
2. Who owes them
3. Whether the invoice has been paid
4. How to create a new invoice
5. How to share a payment link

Prioritize usability and clarity over adding lots of features.

Build the complete frontend experience with polished interactions and realistic sample data.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/53f21d19-164a-42ab-91fc-cbbc08623829).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

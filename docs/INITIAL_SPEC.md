# UI Specification Document: Customer Portal POC

**Design Theme:** "Modern Utility"  
**Visual Style:** Clean, Minimalist SaaS, High Whitespace, Soft Shadows, Rounded Corners  
**Primary Color:** Teal/Ocean Blue (Trust & Service)  
**Secondary Color:** Slate Grey (Text/Neutral)

## 1. Global Layout & Design System

- **Typography:** Sans-serif (e.g., Inter, Roboto, or SF Pro). Clean and readable.
- **Navigation:** Minimalist top navigation bar containing the Logo (left) and User Profile/Logout (right).
- **Responsiveness:** Mobile-first approach, expanding to a centered card layout on desktop.

## Page 1: The Login Gateway

**Objective:** A frictionless entry point requiring email and phone number.

### Features

- Dual-field validation (Email & Phone).
- "Remember Me" toggle.
- Secure "Sign In" action.

### Component Breakdown

- **Central Card:** A floating white container with a soft drop shadow.
- **Brand Header:** Placeholder for the Company Logo at the top of the card.
- **Input Field (Email):** Outlined style, identifying icon (envelope).
- **Input Field (Phone):** Outlined style, identifying icon (phone handset).
- **Primary Button:** Full width, rounded corners, label: "Access Portal".
- **Background:** A subtle abstract geometric pattern or a blurred image of a service workspace (e.g., tools, blueprints) to hint at the industry.

## Page 2: The Booking Dashboard (Home)

**Objective:** A high-level view of all current and past bookings.

### Features

- List view of bookings.
- Status indicators (Scheduled, In Progress, Completed).
- Quick glance details (Date, Service Type).

### Component Breakdown

- **Header:** "My Bookings" title with a "Refresh" icon button.
- **Booking Card (Repeater):**
  - **Container:** White rectangle with subtle border.
  - **Status Badge:** Pill-shaped tag on the top right (Green for 'Complete', Amber for 'In Progress', Blue for 'Scheduled').
  - **Date Block:** A visual square on the left showing the Day and Month (e.g., "28 NOV").
  - **Main Text:** Service Title (e.g., "HVAC Repair" or "Plumbing Inspection") in bold.
  - **Sub Text:** Booking Reference ID (e.g., #SM8-1024).
  - **Action:** A generic chevron (>) or "View Details" button.

## Page 3: The Booking Detail & Communication Hub

**Objective:** The core functional page. Combines job details, attachments, and the messaging system into one cohesive view to keep the POC minimal.

### Layout Structure

- **Split View (Desktop):** Left side for Job Details/Files, Right side for Messaging.
- **Stacked View (Mobile):** Details on top, Messaging on bottom.

### Features

- Job Details: Address, Description, Status.
- Attachments: Gallery view of images/PDFs.
- Messaging: Chat interface to send messages to the backend.

### Component Breakdown

#### Section A: Job Info (Left Panel)

- **Status Hero:** A colored banner at the top indicating current status.
- **Info Grid:** Icons + Text for Address, Technician Name, and Time.
- **Attachment Carousel:** A horizontal scroll section showing thumbnails of documents or photos. Add a "Paperclip" icon header.

#### Section B: Communication (Right Panel)

- **Chat Stream:** A vertical list of message bubbles.
- **System/Tech messages:** Grey bubbles on the left.
- **Customer (User) messages:** Teal bubbles on the right.
- **Input Area:** Fixed at the bottom.
  - Text input field ("Type a message...").
  - "Send" button (Paper plane icon).

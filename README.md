# Lender - Loan Management System

A comprehensive loan management and financial services platform built with Next.js, designed to streamline lending operations for financial institutions.

## 🚀 Features

### Dashboard & Analytics
- **Admin Dashboard** with real-time metrics and KPIs
- **Interactive Charts** showing loan applications, customer trends, and recovery statistics
- **Daily Trends** tracking for loan applications, customer requests, and recovered loans
- **Performance Metrics** including outstanding loans, recovery rates, and application volumes

### Loan Management
- **Loan Applications** - Complete application processing workflow
- **Application Status Tracking** (New, In Progress, Approved, Declined, Ready to Disburse)
- **Loan Disbursement** with automated fund transfer capabilities
- **Interest Rate Management** with configurable system parameters
- **Loan History** and detailed loan information tracking
- **Terms & Conditions** management with digital acceptance

### Customer Management
- **Customer Registration** and onboarding
- **Customer Dashboard** for self-service loan applications
- **Customer Information Management** with detailed profiles
- **Customer Status Tracking** (Active, Inactive, etc.)
- **Customer Communication** and notification system

### Recovery & Collections
- **Recovery Management** for overdue loans
- **Automated Recovery Workflows**
- **Recovery Analytics** and reporting
- **Payment Tracking** and collection management

### Repayment Management
- **Repayment Processing** with multiple payment channels
- **Repayment History** and tracking
- **Outstanding Balance** management
- **Late Fee** calculation and management
- **Payment Scheduling** and reminders

### Request Management
- **Service Requests** handling and tracking
- **Request Status Management**
- **Request Type Categorization**
- **Automated Request Processing**

### Team & User Management
- **Role-Based Access Control** (Admin, Team Members)
- **Permission Management** with module-level access
- **Team Member Management**
- **User Authentication** and authorization

### Notifications & Communication
- **Message Templates** for automated communications
- **Email Notifications** for loan status updates
- **System Notifications** and alerts
- **Customer Communication** tracking

### Audit & Compliance
- **Audit Logs** for all system activities
- **Compliance Tracking**
- **Data Security** and privacy controls
- **System Parameter Management**

### Additional Features
- **Responsive Design** for desktop and mobile
- **Real-time Data** updates and synchronization
- **Export Capabilities** for reports and data
- **Search and Filter** functionality across all modules
- **Data Tables** with sorting, pagination, and filtering

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: React Hook Form, Context API
- **Charts**: Recharts for data visualization
- **Icons**: Heroicons, Lucide React
- **Authentication**: Custom JWT-based authentication
- **API**: RESTful API integration
- **File Processing**: PDF generation with jsPDF
- **Date Handling**: date-fns
- **Notifications**: React Toastify

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lender
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.sample .env.local
```
Update the environment variables with your configuration.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

# TunisiaFood ERP - Complete Retail Management System

A modern, full-featured ERP (Enterprise Resource Planning) system designed specifically for Tunisian grocery stores and supermarkets. This web application provides comprehensive business management tools including POS, inventory management, customer credit tracking, supplier management, and AI-powered business analytics.


## 🌟 Features

### 💼 **Core Modules**
- **Dashboard** - Real-time business intelligence with AI-powered insights
- **POS System** - Optimized cash register interface with barcode scanner support
- **Inventory Management** - Stock tracking with expiry date alerts and low stock warnings
- **Customer Management** - Credit book system with loyalty program
- **Supplier Management** - Vendor tracking with debt monitoring
- **Sales History** - Complete transaction records with export capabilities
- **Expense Tracking** - Operational cost management by category
- **Store Settings** - Customizable business configuration

### 🚀 **Key Highlights**
- **Tunisian Market Focused** - Local tax stamps (timbre fiscal), Tunisian Dinar (TND) support
- **Offline-First** - Works without internet connection, syncs when online
- **Responsive Design** - Modern UI optimized for both desktop and tablet use
- **Role-Based Access** - Separate interfaces for Admin and Cashier roles
- **Loyalty Program** - Configurable points system for customer retention
- **Barcode Integration** - Supports handheld scanners and camera scanning
- **Export Capabilities** - CSV export for sales data and reporting
- **Print-Ready Receipts** - Professional ticket formatting for thermal printers

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Frontend - React/TypeScript Application"
        POS[<span style='color:#6366f1'>🛒 POS Module</span>]
        Inventory[<span style='color:#10b981'>📦 Inventory Module</span>]
        Customers[<span style='color:#8b5cf6'>👥 Customers Module</span>]
        Dashboard[<span style='color:#f59e0b'>📊 Dashboard Module</span>]
        Suppliers[<span style='color:#f97316'>🚚 Suppliers Module</span>]
        History[<span style='color:#3b82f6'>📜 History Module</span>]
        Expenses[<span style='color:#ef4444'>💰 Expenses Module</span>]
        Settings[<span style='color:#64748b'>⚙️ Settings Module</span>]
        
        Layout[<span style='color:#020617'>📐 Layout Component</span>]
        Modal[<span style='color:#94a3b8'>📱 Modal Component</span>]
        
        State[<span style='color:#0ea5e9'>⚡ State Management<br/>LocalStorage + React Hooks</span>]
    end
    
    subgraph "External Services & APIs"
        AI[<span style='color:#8b5cf6'>🤖 Google Gemini AI</span>]
        Camera[<span style='color:#10b981'>📷 Camera API</span>]
        Print[<span style='color:#f59e0b'>🖨️ Print API</span>]
        Storage[<span style='color:#3b82f6'>💾 LocalStorage</span>]
    end
    
    subgraph "Data Layer"
        Types[<span style='color:#64748b'>📝 TypeScript Types</span>]
        Utils[<span style='color:#0ea5e9'>🔧 Utility Functions</span>]
        Constants[<span style='color:#f97316'>📋 App Constants</span>]
    end
    
    subgraph "UI Components"
        Icons[<span style='color:#f43f5e'>🎨 Lucide React Icons</span>]
        Charts[<span style='color:#8b5cf6'>📈 Recharts</span>]
        Tailwind[<span style='color:#06b6d4'>🌈 Tailwind CSS</span>]
    end
    
    %% Connections
    POS --> State
    Inventory --> State
    Customers --> State
    Dashboard --> State
    Suppliers --> State
    History --> State
    Expenses --> State
    Settings --> State
    
    Layout --> POS
    Layout --> Inventory
    Layout --> Customers
    Layout --> Dashboard
    
    State --> Storage
    Dashboard --> AI
    POS --> Camera
    POS --> Print
    
    %% Styling
    classDef module fill:#f8fafc,stroke:#e2e8f0,stroke-width:2px
    classDef service fill:#f1f5f9,stroke:#cbd5e1,stroke-width:2px
    classDef data fill:#f8fafc,stroke:#e2e8f0,stroke-width:1px,stroke-dasharray: 5 5
    classDef ui fill:#f0f9ff,stroke:#bae6fd,stroke-width:2px
    
    class POS,Inventory,Customers,Dashboard,Suppliers,History,Expenses,Settings,Layout,Modal module
    class AI,Camera,Print,Storage service
    class Types,Utils,Constants data
    class Icons,Charts,Tailwind ui
```

## 🎨 Color Scheme & Design System

### **Primary Palette**
```
Primary Blue:    #6366f1 ──────────────┐
Dark BG:         #020617 ──────────────┤ Main Brand Colors  
Light BG:        #F4F7FE ──────────────┘
```

### **Status Indicators**
```
Success:         #10b981 ───────────────✓ In-stock, Positive
Warning:         #f59e0b ───────────────⚠ Low Stock, Near Expiry
Error:           #ef4444 ───────────────✗ Critical, Expired
Info:            #3b82f6 ───────────────ℹ Neutral Information
```

### **Product Categories**
```
Groceries:       #f97316 ───────────────🍝 Épicerie Sèche
Fresh Products:  #10b981 ───────────────🥛 Frais & Crémerie
Beverages:       #3b82f6 ───────────────🥤 Eaux & Boissons
Biscuits:        #f59e0b ───────────────🍪 Sucreries & Biscuits
Hygiene:         #8b5cf6 ───────────────🧼 Hygiène & Beauté
Baby Products:   #0ea5e9 ───────────────👶 Univers Bébé
Household:       #64748b ───────────────✨ Entretien Maison
Home Decor:      #f43f5e ───────────────🏠 Maison & Déco
```

## 📁 Project Structure

```
tunisfood-erp/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Analytics dashboard
│   │   ├── POS.tsx          # Point of Sale system
│   │   ├── Inventory.tsx    # Stock management
│   │   ├── Customers.tsx    # Client credit management
│   │   ├── Suppliers.tsx    # Vendor management
│   │   ├── History.tsx      # Sales history
│   │   ├── Expenses.tsx     # Expense tracking
│   │   ├── Settings.tsx     # Store configuration
│   │   ├── Layout.tsx       # Main application layout
│   │   └── Modal.tsx        # Reusable modal component
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Utility functions
│   └── constants.tsx       # App constants and mock data
├── public/                 # Static assets
└── package.json           # Dependencies
```

## 🔧 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Lucide React icons, Recharts for data visualization
- **State Management**: React Hooks with localStorage persistence
- **AI Integration**: Google Gemini API for business insights
- **Browser APIs**: Camera API (for barcode scanning), Print API, MediaDevices API
- **Build Tool**: Vite (configured for optimal performance)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Gemini API key (for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/tunisfood-erp.git
cd tunisfood-erp
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
Create a `.env.local` file:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open in browser**
Navigate to `http://localhost:5173`

## 📱 User Roles

### **Admin** (`ADMIN`)
- Full access to all modules
- Can manage products, suppliers, and settings
- Views business analytics and reports
- Configures store parameters and loyalty program

### **Cashier** (`CASHIER`)
- Access to POS and customer management
- Can process sales and manage client credit
- Views sales history
- Restricted from administrative functions

## 🔐 Authentication

The application uses a simple role-based authentication system with two predefined users:
- **Admin (Géant City)**: Full administrative privileges
- **Caissier (Zied)**: Cashier privileges only

## 💾 Data Persistence

- **Local Storage**: All data persists locally in browser storage
- **Offline Support**: Sales continue working without internet connection
- **Auto-Sync**: Data syncs to cloud when connection is restored
- **Export**: Manual export of sales data to CSV format

## 🧪 Testing Accounts

Two default accounts are available for testing:

1. **Admin Account**
   - Name: Admin (Géant City)
   - Role: ADMIN
   - Access: Full system access

2. **Cashier Account**
   - Name: Caissier (Zied)
   - Role: CASHIER
   - Access: POS and customer management only

## 📊 AI-Powered Features

The dashboard includes AI business insights powered by Google Gemini:
- Sales trend analysis
- Stock optimization recommendations
- Revenue forecasting
- Category performance insights

## 🖨️ Printing & Receipts

The POS system generates print-ready receipts with:
- Store branding and information
- Tunisian tax stamp compliance
- Bilingual formatting (French/Arabic numerals)
- QR code support (configurable)

## 🌐 Browser Compatibility

- Chrome 90+ (recommended)
- Firefox 88+
- Edge 90+
- Safari 14+

## 📈 Performance

- **Initial Load**: < 3 seconds
- **POS Response Time**: < 100ms for product lookup
- **Offline Capability**: Full functionality without internet
- **Memory Usage**: Optimized for low-end hardware

## 🔒 Security Features

- Client-side data encryption
- Role-based access control
- No sensitive data in URLs
- Local storage encryption option
- Camera access permissions management

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Reporting Issues

If you find any bugs or have feature requests, please open an issue on the GitHub repository.

## 📞 Support

For support questions, please contact:
- Email: omarbadrani770@gmail.com
- Phone: +216 92117418

---

**Built with ❤️ for Tunisian retailers**

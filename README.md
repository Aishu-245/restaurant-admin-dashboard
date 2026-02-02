# 🍽️ Restaurant Admin Dashboard - Eatoes Intern Assessment

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](YOUR_NETLIFY_URL)
[![API](https://img.shields.io/badge/API-Live-blue?style=for-the-badge)](YOUR_RENDER_URL)

A full-stack MERN restaurant admin dashboard with advanced features including real-time search, optimistic UI updates, MongoDB aggregation, and comprehensive order management.

![Restaurant Admin Dashboard](https://via.placeholder.com/1200x600?text=Restaurant+Admin+Dashboard)

## ✨ Features

### 🎯 Core Functionality
- **Menu Management**: Full CRUD operations for menu items with image support
- **Real-time Search**: Debounced search with MongoDB text indexing (300ms delay)
- **Smart Filtering**: Filter by category, availability, and price range
- **Order Management**: View, track, and update order statuses
- **Analytics Dashboard**: Top 5 selling items with MongoDB aggregation
- **Optimistic UI**: Instant updates with rollback on error

### 🚀 Technical Highlights
- ✅ Debounced search implementation (Challenge 1)
- ✅ MongoDB aggregation for analytics (Challenge 2)
- ✅ Optimistic UI updates with error handling (Challenge 3)
- ✅ Custom React hooks (useDebounce, useToast)
- ✅ Context API for global state management
- ✅ Pagination for large datasets
- ✅ Comprehensive error handling & validation
- ✅ Responsive design with modern aesthetics
- ✅ Production-ready deployment configurations

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Component-based UI
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Lucide React** - Modern icon library
- **CSS3** - Custom design system with gradients & animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### DevOps
- **Netlify** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database

## 📁 Project Structure

```
restaurant-admin-dashboard/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── MenuItem.js           # Menu item schema
│   │   └── Order.js              # Order schema
│   ├── controllers/
│   │   ├── menuController.js     # Menu business logic
│   │   └── orderController.js    # Order & analytics logic
│   ├── routes/
│   │   ├── menuRoutes.js         # Menu API routes
│   │   └── orderRoutes.js        # Order API routes
│   ├── scripts/
│   │   └── seed.js               # Database seed script
│   ├── .env.example              # Environment template
│   ├── server.js                 # Entry point
│   └── package.json
│
└── client/
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # Axios configuration
    │   ├── components/
    │   │   └── Sidebar.jsx       # Navigation sidebar
    │   ├── context/
    │   │   └── ToastContext.jsx  # Toast notifications
    │   ├── hooks/
    │   │   └── useDebounce.js    # Custom debounce hook
    │   ├── pages/
    │   │   ├── Dashboard.jsx     # Home dashboard
    │   │   ├── MenuManagement.jsx# Menu CRUD page
    │   │   ├── Orders.jsx        # Orders management
    │   │   └── Analytics.jsx     # Top sellers analytics
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # React entry point
    │   └── index.css             # Design system
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB Atlas account (free tier)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd restaurant-admin-dashboard
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your MongoDB Atlas connection string
```

**Environment Variables (.env)**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/restaurant-admin?retryWrites=true&w=majority
NODE_ENV=development
```

### 3. Seed Database
```bash
npm run seed
```

### 4. Start Backend Server
```bash
npm run dev
```
Server runs on http://localhost:5000

### 5. Frontend Setup
Open a new terminal:
```bash
cd client
npm install

# Create .env file
cp .env.example .env
```

**Environment Variables (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Start Frontend
```bash
npm run dev
```
App runs on http://localhost:3000

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: YOUR_RENDER_URL/api
```

### Menu Endpoints

#### Get All Menu Items
```http
GET /menu
Query Parameters:
  - category: string (Appetizer|Main Course|Dessert|Beverage)
  - availability: boolean
  - minPrice: number
  - maxPrice: number

Response:
{
  "success": true,
  "count": 16,
  "data": [...]
}
```

#### Search Menu Items
```http
GET /menu/search?q=pizza

Response:
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

#### Get Single Menu Item
```http
GET /menu/:id

Response:
{
  "success": true,
  "data": {...}
}
```

#### Create Menu Item
```http
POST /menu
Body:
{
  "name": "Margherita Pizza",
  "description": "Classic Italian pizza",
  "category": "Main Course",
  "price": 14.99,
  "ingredients": ["Dough", "Tomato", "Mozzarella", "Basil"],
  "preparationTime": 20,
  "imageUrl": "https://...",
  "isAvailable": true
}

Response:
{
  "success": true,
  "message": "Menu item created successfully",
  "data": {...}
}
```

#### Update Menu Item
```http
PUT /menu/:id
Body: (same as create)

Response:
{
  "success": true,
  "message": "Menu item updated successfully",
  "data": {...}
}
```

#### Delete Menu Item
```http
DELETE /menu/:id

Response:
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

#### Toggle Availability
```http
PATCH /menu/:id/availability

Response:
{
  "success": true,
  "message": "Menu item enabled successfully",
  "data": {...}
}
```

### Order Endpoints

#### Get All Orders
```http
GET /orders
Query Parameters:
  - status: string (Pending|Preparing|Ready|Delivered|Cancelled)
  - page: number (default: 1)
  - limit: number (default: 10)

Response:
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```

#### Get Single Order
```http
GET /orders/:id

Response:
{
  "success": true,
  "data": {
    "orderNumber": "ORD-20260201-0001",
    "items": [...],
    "totalAmount": 45.97,
    ...
  }
}
```

#### Create Order
```http
POST /orders
Body:
{
  "items": [
    {
      "menuItem": "65abc123...",
      "quantity": 2
    }
  ],
  "customerName": "John Doe",
  "tableNumber": 5
}

Response:
{
  "success": true,
  "message": "Order created successfully",
  "data": {...}
}
```

#### Update Order Status
```http
PATCH /orders/:id/status
Body:
{
  "status": "Preparing"
}

Response:
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {...}
}
```

#### Get Top Sellers (Analytics)
```http
GET /orders/analytics/top-sellers

Response:
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65abc...",
      "name": "Margherita Pizza",
      "category": "Main Course",
      "price": 14.99,
      "totalQuantity": 45,
      "totalRevenue": 674.55
    },
    ...
  ]
}
```

## 🎨 Design System

The application features a premium design system with:

### Color Palette
- **Primary Gradient**: Purple to violet gradient (#667eea → #764ba2)
- **Success Gradient**: Green to cyan (#43e97b → #38f9d7)
- **Vibrant Accents**: Dynamic colors for visual appeal

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weight Range**: 300 to 800
- **Hierarchy**: Clear visual hierarchy with gradient headings

### Components
- **Glassmorphism**: Frosted glass effect on cards
- **Smooth Animations**: 250ms cubic-bezier transitions
- **Micro-interactions**: Hover effects and state feedback
- **Responsive Grid**: Auto-fit layouts for all screen sizes

## 🧪 Technical Challenges Implementation

### Challenge 1: Debounced Search ✅
**File**: `client/src/hooks/useDebounce.js`

Custom hook that delays API calls until user stops typing for 300ms:
```javascript
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

**Features**:
- ✅ 300ms delay implementation
- ✅ Loading indicator during search
- ✅ Empty query handling
- ✅ Special character support

### Challenge 2: MongoDB Aggregation ✅
**File**: `server/controllers/orderController.js`

Aggregation pipeline for top 5 selling items:
```javascript
const topSellers = await Order.aggregate([
  { $match: { status: 'Delivered' } },
  { $unwind: '$items' },
  { $group: {
      _id: '$items.menuItem',
      totalQuantity: { $sum: '$items.quantity' },
      totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
  }},
  { $lookup: {
      from: 'menuitems',
      localField: '_id',
      foreignField: '_id',
      as: 'menuItemDetails'
  }},
  { $unwind: '$menuItemDetails' },
  { $sort: { totalQuantity: -1 } },
  { $limit: 5 }
]);
```

**Features**:
- ✅ $unwind to flatten arrays
- ✅ $group for aggregation
- ✅ $lookup for joins
- ✅ Sorted and limited results

### Challenge 3: Optimistic UI Updates ✅
**File**: `client/src/pages/MenuManagement.jsx`

Instant UI updates with rollback on error:
```javascript
const toggleAvailability = async (item) => {
  const previousItems = [...menuItems];
  
  // 1. Update UI immediately
  setMenuItems(prevItems =>
    prevItems.map(menuItem =>
      menuItem._id === item._id
        ? { ...menuItem, isAvailable: !menuItem.isAvailable }
        : menuItem
    )
  );

  try {
    // 2. API call in background
    await api.patch(`/menu/${item._id}/availability`);
    showSuccess('Updated successfully');
  } catch (error) {
    // 3. Rollback on error
    setMenuItems(previousItems);
    showError('Failed. Changes reverted.');
  }
};
```

**Features**:
- ✅ Immediate UI update
- ✅ Background API call
- ✅ Error handling with rollback
- ✅ Toast notification

## 🚀 Deployment Guide

### MongoDB Atlas Setup
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. **Database Access**: Create user with read/write permissions
4. **Network Access**: Whitelist `0.0.0.0/0` (or specific IPs)
5. Get connection string from "Connect" → "Connect your application"

### Backend Deployment on Render
1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   ```
   MONGODB_URI=<your-atlas-connection-string>
   PORT=5000
   NODE_ENV=production
   ```
6. Deploy and note your backend URL

### Frontend Deployment on Netlify
1. Create account at [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Base Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `client/dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
6. Create `client/public/_redirects` file:
   ```
   /* /index.html 200
   ```
7. Deploy!

## 💡 Challenges Faced & Solutions

### Challenge: CORS Issues
**Problem**: Frontend couldn't connect to backend API
**Solution**: Configured CORS middleware in Express to accept requests from frontend domain

### Challenge**: Real-time Search Performance
**Problem**: Too many API calls on every keystroke
**Solution**: Implemented custom useDebounce hook with 300ms delay

### Challenge: MongoDB Text Search
**Problem**: Needed to search across multiple fields
**Solution**: Created compound text index on name and ingredients fields

### Challenge: Order Number Generation
**Problem**: Unique, sequential order numbers needed
**Solution**: Pre-save Mongoose hook with date-based formatting

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/1200x600?text=Dashboard+View)

### Menu Management
![Menu Management](https://via.placeholder.com/1200x600?text=Menu+Management)

### Orders
![Orders](https://via.placeholder.com/1200x600?text=Orders+Dashboard)

### Analytics
![Analytics](https://via.placeholder.com/1200x600?text=Analytics+View)

## 🔒 Security Best Practices

- ✅ Environment variables for sensitive data
- ✅ MongoDB connection string encryption
- ✅ CORS configuration
- ✅ Input validation with Mongoose schemas
- ✅ Error handling without exposing internals

## 🧪 Testing Recommendations

### Backend Testing
```bash
# Install Postman or use VS Code REST Client
# Import the provided API collection
# Test all endpoints with sample data
```

### Frontend Testing
```bash
# Manual testing checklist:
# ✅ Search with various queries
# ✅ Toggle availability multiple times
# ✅ Create/Edit/Delete menu items
# ✅ Filter by different categories
# ✅ Update order statuses
# ✅ Check pagination
# ✅ View analytics
```

## 📝 Future Enhancements

- [ ] User authentication & authorization
- [ ] Real-time order notifications (WebSocket)
- [ ] Image upload to cloud storage
- [ ] Advanced analytics with charts
- [ ] Export data to CSV/PDF
- [ ] Multi-restaurant support
- [ ] Mobile app version

## 👨‍💻 Author

**Your Name**
- Portfolio: [yourportfolio.com](https://yourportfolio.com)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- GitHub: [@yourusername](https://github.com/yourusername)

## 📄 License

This project is created for the Eatoes Intern Technical Assessment.

## 🙏 Acknowledgments

- Eatoes team for the comprehensive assessment
- MongoDB documentation for aggregation examples
- React community for best practices
- Unsplash for placeholder images

---

**Live Demo**: [YOUR_NETLIFY_URL](YOUR_NETLIFY_URL)  
**API Documentation**: [YOUR_RENDER_URL/api](YOUR_RENDER_URL/api)

Built with ❤️ using the MERN stack

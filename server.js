const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());


const sequelize = require('./db');

const userRoutes = require('./routes/authroute');
const openingRoutes = require('./routes/openingroute');
const itemsRoutes = require('./routes/itemsroute');
const bookingRoutes = require('./routes/bookingroute');
const uploadRoute = require('./routes/uploadroute');
const galleryRoutes = require('./routes/galleryroute');
const weekly_menuRoutes = require('./routes/weeklymenuroute');
const RestaurantConfigRoutes = require('./routes/restaurantConfigroutes');
const notificationRoute = require('./routes/notificationRoute');
const emailRouter = require('./routes/email'); // adjust path

app.use('/api', emailRouter);
app.use('/api/users', userRoutes);
app.use('/api/openings', openingRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/galleries', galleryRoutes)
app.use('/api/weekly_menu', weekly_menuRoutes)
app.use('/api/restaurant_config', RestaurantConfigRoutes);
app.use('/api/notifications', notificationRoute);

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});

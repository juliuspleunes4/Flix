# Changelog

## [1.1.0] - 2025-07-06

### Fixed
- ✅ Port consistency: All components now use port 3000 (backend, frontend proxy, API calls)
- ✅ Build errors: Fixed TailwindCSS PostCSS configuration 
- ✅ Removed unused video.js dependencies and imports
- ✅ Fixed CSS syntax errors in styles.css
- ✅ TypeScript compilation errors resolved

### Improved
- 🎯 Enhanced video support: Added support for .mov and .wmv formats
- 📊 Better file information: Added file size and modification date display
- 🔧 Improved error handling in backend with better logging and directory checks
- 📈 Added server stats API endpoint for monitoring
- 🎨 Better responsive design with improved CSS
- 🔍 Enhanced movie metadata with size and timestamp information
- 📝 Improved startup logging with environment and directory status

### Added
- ➕ New API endpoint: `/api/stats` for server statistics
- ➕ File size formatting utility function
- ➕ Auto-creation of movies directory if it doesn't exist
- ➕ Better MIME type detection for different video formats
- ➕ Enhanced movie information display on watch page

### Developer Experience
- 🛠️ Better TypeScript interfaces with optional fields
- 🐛 Improved error messages and debugging information
- 📋 Enhanced logging for better troubleshooting
- 🔄 More robust file system operations

### Configuration
- ⚙️ Updated .env file with better default cookie secret
- 📂 Improved directory structure documentation
- 🔗 Fixed all port references to use consistent 3000

## [1.0.0] - 2025-07-06

### Initial Release
- 🎬 Basic movie streaming functionality
- 🔐 Password-based authentication
- 📱 Responsive web interface
- 🎥 Support for MP4, MKV, AVI formats
- 🍪 Cookie-based session management

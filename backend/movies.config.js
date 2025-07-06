// Google Drive Movies Configuration
// To add a Google Drive movie:
// 1. Upload movie to Google Drive
// 2. Right-click -> Share -> Copy link
// 3. Convert the share link to direct download link:
//    From: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
//    To: https://drive.google.com/uc?export=download&id=FILE_ID
// 4. Add to the array below

// Make sure you use the correct id! It should contain gdrive_ in the id field. Learned this the hard way lmao.

const googleDriveMovies = [
  {
    id: 'gdrive_instant_family', 
    title: 'Instant Family',
    description: 'A heartwarming comedy about a couple who decide to adopt three siblings from foster care, leading to unexpected challenges and joys.',
    year: 2018,
    genre: ['Comedy', 'Drama'],
    duration: '119 min',
    rating: 'PG-13',
    thumbnail: 'https://tse3.mm.bing.net/th/id/OIP.l-VfUToCVvu_1WnHw3aLcAHaK-?rs=1&pid=ImgDetMain&o=7&rm=3',
    url: 'https://drive.google.com/file/d/139KuCd4Fsch0YHE8wJYOxDNSICNAwG_q/preview',
    source: 'gdrive',
    size: 2118155194, 
    quality: '1080p'
  },
  // Add more movies here as needed
];

module.exports = {
  googleDriveMovies
};

import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const CustomPathInfo: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#141414' }}>
      <NavBar showSearch={false} />
      
      <div style={{ paddingTop: '6rem', paddingBottom: '2rem' }}>
        <div style={{ 
          maxWidth: '50rem', 
          margin: '0 auto', 
          padding: '0 2rem' 
        }}>
          <div style={{ 
            backgroundColor: '#1a1a1a',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>
                Custom Movie Path - Information
              </h1>
              <Link
                to="/movies"
                style={{
                  color: '#E50914',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  border: '1px solid #E50914',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s'
                }}
              >
                ← Back to Movies
              </Link>
            </div>

            <div style={{ color: '#D1D5DB', lineHeight: '1.6' }}>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem' 
                }}>
                  How Custom Movie Path Works
                </h2>
                <p style={{ marginBottom: '1rem' }}>
                  The Custom Movie Path feature allows you to scan a local directory on your computer for movies. 
                  FLIX will automatically detect movie files and their metadata, making them available in your movie library.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  This is perfect for adding your personal movie collection to FLIX, whether they're downloaded movies, 
                  home videos, or any other video files you want to organize and watch through the FLIX interface.
                </p>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem' 
                }}>
                  Required Folder Structure
                </h2>
                <p style={{ marginBottom: '1rem' }}>
                  Your movies must be organized in a specific folder structure for FLIX to detect them properly:
                </p>
                <div style={{
                  backgroundColor: '#2a2a2a',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  border: '1px solid #374151'
                }}>
                  <div>Your Custom Path/</div>
                  <div>├── Movie 1/</div>
                  <div>│   ├── movie.mp4</div>
                  <div>│   └── source.txt</div>
                  <div>├── Movie 2/</div>
                  <div>│   ├── movie.mkv</div>
                  <div>│   └── source.txt</div>
                  <div>├── Movie 3/</div>
                  <div>│   ├── movie.avi</div>
                  <div>│   └── source.txt</div>
                  <div>└── Another Movie/</div>
                  <div>    ├── film.mov</div>
                  <div>    └── source.txt</div>
                </div>
                <div style={{
                  backgroundColor: '#1f2937',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  marginBottom: '1rem',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <strong>Important:</strong> Each movie must be in its own folder, and each folder must contain 
                  both a video file and a source.txt file with movie information.
                </div>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem' 
                }}>
                  Supported Video Formats
                </h2>
                <p style={{ marginBottom: '1rem' }}>
                  FLIX supports the following video file formats:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ backgroundColor: '#2a2a2a', padding: '0.75rem', borderRadius: '0.375rem', textAlign: 'center' }}>
                    <strong>.mp4</strong> - Most common
                  </div>
                  <div style={{ backgroundColor: '#2a2a2a', padding: '0.75rem', borderRadius: '0.375rem', textAlign: 'center' }}>
                    <strong>.mkv</strong> - High quality
                  </div>
                  <div style={{ backgroundColor: '#2a2a2a', padding: '0.75rem', borderRadius: '0.375rem', textAlign: 'center' }}>
                    <strong>.avi</strong> - Classic format
                  </div>
                  <div style={{ backgroundColor: '#2a2a2a', padding: '0.75rem', borderRadius: '0.375rem', textAlign: 'center' }}>
                    <strong>.mov</strong> - QuickTime
                  </div>
                  <div style={{ backgroundColor: '#2a2a2a', padding: '0.75rem', borderRadius: '0.375rem', textAlign: 'center' }}>
                    <strong>.wmv</strong> - Windows Media
                  </div>
                </div>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem' 
                }}>
                  The source.txt File
                </h2>
                <p style={{ marginBottom: '1rem' }}>
                  Each movie folder must contain a <code style={{ 
                    backgroundColor: '#374151', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    fontFamily: 'monospace' 
                  }}>source.txt</code> file with valid JSON containing movie metadata. This file tells FLIX 
                  about your movie's details like title, description, genre, and more.
                </p>
                
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem' 
                }}>
                  Example source.txt Content:
                </h3>
                <div style={{
                  backgroundColor: '#2a2a2a',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  border: '1px solid #374151',
                  overflowX: 'auto'
                }}>
                  <div>{'{'}</div>
                  <div>  "title": "The Matrix",</div>
                  <div>  "description": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",</div>
                  <div>  "year": 1999,</div>
                  <div>  "genre": ["Action", "Sci-Fi", "Thriller"],</div>
                  <div>  "duration": "136 min",</div>
                  <div>  "rating": "R",</div>
                  <div>  "quality": "1080p",</div>
                  <div>  "stars": 4.5</div>
                  <div>{'}'}</div>
                </div>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem' 
                }}>
                  JSON Fields Explanation
                </h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#60a5fa' }}>title</strong>
                      <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>Required</span>
                    </div>
                    <p style={{ margin: 0 }}>The display name of your movie. This will appear in the FLIX interface.</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#60a5fa' }}>description</strong>
                      <span style={{ color: '#10b981', fontSize: '0.875rem' }}>Optional</span>
                    </div>
                    <p style={{ margin: 0 }}>A brief plot summary or description of the movie.</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#60a5fa' }}>year</strong>
                      <span style={{ color: '#10b981', fontSize: '0.875rem' }}>Optional</span>
                    </div>
                    <p style={{ margin: 0 }}>Release year as a number (e.g., 1999, 2023).</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#60a5fa' }}>genre</strong>
                      <span style={{ color: '#10b981', fontSize: '0.875rem' }}>Optional</span>
                    </div>
                    <p style={{ margin: 0 }}>Array of genres (e.g., ["Action", "Drama", "Comedy"]).</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#60a5fa' }}>duration</strong>
                      <span style={{ color: '#10b981', fontSize: '0.875rem' }}>Optional</span>
                    </div>
                    <p style={{ margin: 0 }}>Runtime as a string (e.g., "120 min", "2h 30m").</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#60a5fa' }}>rating</strong>
                      <span style={{ color: '#10b981', fontSize: '0.875rem' }}>Optional</span>
                    </div>
                    <p style={{ margin: 0 }}>MPAA rating (e.g., "G", "PG", "PG-13", "R", "NC-17").</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#60a5fa' }}>quality</strong>
                      <span style={{ color: '#10b981', fontSize: '0.875rem' }}>Optional</span>
                    </div>
                    <p style={{ margin: 0 }}>Video quality (e.g., "720p", "1080p", "4K", "HD").</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#60a5fa' }}>stars</strong>
                      <span style={{ color: '#10b981', fontSize: '0.875rem' }}>Optional</span>
                    </div>
                    <p style={{ margin: 0 }}>Rating out of 5 as a number (e.g., 4.5, 3.0, 5.0).</p>
                  </div>
                </div>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem' 
                }}>
                  Step-by-Step Setup Guide
                </h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ 
                    backgroundColor: '#1f2937', 
                    padding: '1rem', 
                    borderRadius: '0.375rem',
                    borderLeft: '4px solid #3b82f6'
                  }}>
                    <strong style={{ color: '#60a5fa' }}>Step 1:</strong> Create a main folder for your custom movies (e.g., "My Movies")
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1f2937', 
                    padding: '1rem', 
                    borderRadius: '0.375rem',
                    borderLeft: '4px solid #3b82f6'
                  }}>
                    <strong style={{ color: '#60a5fa' }}>Step 2:</strong> For each movie, create a subfolder with a descriptive name
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1f2937', 
                    padding: '1rem', 
                    borderRadius: '0.375rem',
                    borderLeft: '4px solid #3b82f6'
                  }}>
                    <strong style={{ color: '#60a5fa' }}>Step 3:</strong> Place your video file in the movie's subfolder
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1f2937', 
                    padding: '1rem', 
                    borderRadius: '0.375rem',
                    borderLeft: '4px solid #3b82f6'
                  }}>
                    <strong style={{ color: '#60a5fa' }}>Step 4:</strong> Create a source.txt file with the movie's JSON metadata
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1f2937', 
                    padding: '1rem', 
                    borderRadius: '0.375rem',
                    borderLeft: '4px solid #3b82f6'
                  }}>
                    <strong style={{ color: '#60a5fa' }}>Step 5:</strong> Use the Custom Path feature in FLIX to scan your main folder
                  </div>
                </div>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem' 
                }}>
                  Troubleshooting Common Issues
                </h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <strong style={{ color: '#ef4444' }}>Error: "Path does not exist"</strong>
                    <p style={{ margin: '0.5rem 0 0 0' }}>
                      • Verify the path is correct and exists on your system<br/>
                      • Make sure you're using the correct path format for your operating system<br/>
                      • Check that the folder is accessible and not in a restricted location
                    </p>
                  </div>
                  
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <strong style={{ color: '#ef4444' }}>Error: "Failed to scan custom path"</strong>
                    <p style={{ margin: '0.5rem 0 0 0' }}>
                      • Ensure the FLIX server has read permissions for the directory<br/>
                      • Check that movie folders contain both video files and source.txt<br/>
                      • Verify that source.txt files contain valid JSON (no syntax errors)
                    </p>
                  </div>
                  
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <strong style={{ color: '#ef4444' }}>Movies not appearing in library</strong>
                    <p style={{ margin: '0.5rem 0 0 0' }}>
                      • Check that each movie is in its own subfolder<br/>
                      • Ensure video files have supported extensions (.mp4, .mkv, .avi, .mov, .wmv)<br/>
                      • Verify source.txt files are named exactly "source.txt" (case-sensitive on some systems)
                    </p>
                  </div>
                  
                  <div style={{ backgroundColor: '#2a2a2a', padding: '1rem', borderRadius: '0.375rem' }}>
                    <strong style={{ color: '#ef4444' }}>JSON parsing errors</strong>
                    <p style={{ margin: '0.5rem 0 0 0' }}>
                      • Use a JSON validator to check your source.txt files<br/>
                      • Ensure all quotes are properly escaped<br/>
                      • Make sure arrays use square brackets [ ] and objects use curly braces { }<br/>
                      • Don't forget commas between fields (but not after the last field)
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem' 
                }}>
                  Need More Help?
                </h2>
                <p style={{ marginBottom: '1rem' }}>
                  If you're still having trouble setting up your custom movie path, here are some additional resources:
                </p>
                <ul style={{ listStyle: 'disc', marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Check the server console logs for detailed error messages</li>
                  <li>Use online JSON validators to verify your source.txt files</li>
                  <li>Start with a small test folder containing just one movie</li>
                  <li>Make sure your path doesn't contain special characters or spaces that might cause issues</li>
                </ul>
                
                <div style={{
                  backgroundColor: '#1f2937',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  marginTop: '2rem',
                  borderLeft: '4px solid #10b981'
                }}>
                  <strong style={{ color: '#10b981' }}>Pro Tip:</strong> Start with a simple setup using just the "title" field in your source.txt files, 
                  then gradually add more metadata as you become comfortable with the format.
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPathInfo;

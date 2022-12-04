const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path')
const app = express();

app.use('/static', express.static(path.join(__dirname, 'static')))
app.use('/cropped', express.static('cropped'))

// Set up Multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Set up Multer for handling file uploads
const croppedFolder = multer({ dest: 'cropped/' });


app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.post('/upload', upload.single('image'), (req, res) => {

    // Read the number of pixels to crop from the request body
    const pixels = Number(req.body.pixels);

  // Open the uploaded image
  Jimp.read(req.file.path)
    .then(im => {        
        // Crop the specified number of pixels from the edges of the image
        const width = im.bitmap.width;
        const height = im.bitmap.height;
        im.crop(pixels, pixels, width - (pixels*2), height - (pixels*2));

        // Generate a unique filename for the cropped image
        const filename = `cropped-${Date.now()}.jpg`;
        // Save the cropped image to the "cropped" folder
        im.write(`cropped/${filename}`);

        // Send the resulting image back to the user
        var host = req.get('host');
        res.redirect('/cropped/' + filename);

    })
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});

app.post('/delete-images', (req, res) => {
    const fs = require('fs');

    // Define the folder where the images are saved
    const uploadFolderPath = './uploads';
    const croppedFolderPath = './cropped';

    const folders = [uploadFolderPath,croppedFolderPath];
    
    // Use the `fs.readdir` method to get a list of all the files in the folder

    folders.forEach(folder => {
        
      fs.readdir(folder, (err, files) => {
        if (err) {
          // Handle the error
          console.error(err);
        } else {
          // Loop through the array of files
          files.forEach(file => {
            // Use the `fs.unlink` method to delete each file
            fs.unlink(`${folder}/${file}`, err => {
              if (err) {
                // Handle the error
                console.error(err);
              }
            });
          });
        }
      });

    });      
    
});

// start server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

# file-upload-example
Simple example of uploading a csv file from a React UI to a Python server

UI scaffolded using [template-vite-react-ts-tailwind](https://github.com/RoyRao2333/template-vite-react-ts-tailwind/tree/main)

## Objectives
- Python server
  - [x] Single POST endpoint `upload`
  - [x] Takes a CSV file
  - [x] Parses CSV file into JSON
  - [x] If error occures (ie invalid CSV) returns 400
  - [x] Responds 200 with JSON payload
- React UI
  - Accepts CSV file
    - [x] Drag and drop CSV file
    - [x] Input type "file" to accept CSV file
  - Upload button
    - [x] On click sends CSV file to python server
    - [x] Enters into loading state while waiting for response
    - [x] Clears error message if any
    - [x] Clears success message if any
    - [x] If request results in error (400, 500) show error message
    - [x] If request results in success (200) console.log the response and show success message

### UI Improvements
- [ ] Default `<input type="file">` replaced with a button wrapper
- [ ] Break `App.tsx` into components
- [ ] Success/Error divs become components
  - [ ] Success component shows response from server
- [ ] Don't allow user to select/drop files which are not CSV
- [ ] Use `fetch` instead of `axios` - no real reason to use `axios` over `fetch`
- [ ] Improve active/focus styles, make consistent across components
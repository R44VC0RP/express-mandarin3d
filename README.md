# express-mandarin3d

## Basic Layout (Ryan Only)

### Production URL's 

Frontend TMP (Vercel) URL: `vdev.mandarin3d.com`
Backend API (Server Side Events): `v.api.mandarin3d.com`<br>
Backend API (Slicing Events): `slicing.api.mandarin3d.com`<br>


### Development URL's 
First create branch called `dev`<br>

Frontend TMP (Vercel) URL: `dev.vdev.mandarin3d.com` (Not implemented yet)
Backend API (Server Side Events): `dev.v.api.mandarin3d.com`<br>
Backend API (Slicing Events): `slicing.api.mandarin3d.com`<br>

## To-Do and Project Plan

- [x] Connect server and backend
- [ ] Connect MongoDB with mongoose.
- [ ] (client) Create Header
- [ ] (server) Create cart management
- [ ] (client) Create admin panel and login
- [ ] (server) Setup authentication


- [ ] (client & server) Bulk file discount
- [ ] (client) Make the every page a dropzone (home, cart) (except admin panel)

## Order Flow

1. User uploads file to be sliced
IF (FILE is ABLE TO BE SLICED):
    get mass, dimensions
    create product in stripe
    create file in database (attach stripe product id)


## Other Services:

1. Custom Nameplate (existing example)
    - requires:
        - nameplate text
        - nameplate font (select from options)
        - nameplate plate color (select from options)
        - nameplate text color

2. Custom Cookie Cutter
    - requires:
        - cookie cutter source (image, pdf)
        - cookie cutter color (select from options)

3. Custom Business Plaque (uploadthing example)
    - requires:
        - business logo (image, pdf)
        - business name
        - plaque color (select from options)
        - plaque font (select from options)
        - plaque text color

4. Custom Keychains (multicolor)
    - requires:
        - keychain source (image, pdf)
        - keychain color (select from options)
        - keychain text
        - keychain text color


export default Images = new FS.Collection("images", {
  filter: {
    maxSize: 26214400,
    allow: {
      contentTypes: ['image/*']
    }
  },
  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
});
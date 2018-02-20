// get necessary data from built with com
const builtWithSlicer = (contents) => {
  // sanitize content
  contents = contents.replace(/(?:\\[rn]|[\r\n]|\\|\_+)+/g, "");
  let slice = contents.split("<div class=\"container\"><section><div class=\"row\"><div class=\"span8\"><div class=\"titleBox\">");
  slice = slice[1].split("<div class=\"titleBox noP\"><ul class=\"nav nav-pills\"><li><span>Access more of BuiltWith</span></li></ul>");

  // get the base content
  let baseContent = slice[0];
  let sliceTitleBox = baseContent.split("<div class=\"titleBox\">");

  // get the necessary data
  let data = [];
  for (let body of sliceTitleBox) {
    let sliceTitle = body.split("<li class=\"active\"><span>");
    sliceTitle = sliceTitle[1].split("</span></li>");
    let title = sliceTitle[0];

    let sliceItem = sliceTitle[1];
    sliceItem = sliceItem.split("<div class=\"techItem\">");
    sliceItem.splice(0, 1); // remove first element

    let item = [];
    for (let bodyItem of sliceItem) {
      let subSliceItem = bodyItem.split("</a></h3>");
      let sliceItemTitle = subSliceItem[0];
      sliceItemTitle = sliceItemTitle.split("//trends.builtwith.com/");
      sliceItemTitle = sliceItemTitle[2].split("\">");
      let itemTitle = sliceItemTitle[1];

      item.push({
        "title": itemTitle,
      });
    }

    data.push({
      title,
      item
    });
  }

  return data;
};

module.exports = {
  builtweb: builtWithSlicer
};

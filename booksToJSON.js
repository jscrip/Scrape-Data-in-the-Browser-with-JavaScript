(()=>{ var collection = [],  //IIFE followed by an empty array that will store the scraped data.  More info on immediately invoked function expressions: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
  cleanText = (text) => text.replace(/[\n\s\t\r]+/gm," ").trim(), //a function that places a single space in place of any part of the string that contains line breaks, spaces, tabs, and/or return characters.
  textFromEl = (el, query, attr) => el.querySelector(query) ? cleanText(el.querySelector(query)[attr]) : "", //if el.querySelector(query) is truthy, then attempt to extract/clean the text, else return an empty string.
  books = document.querySelectorAll(".product_pod"); //select the book elements and store them in a list
  for (const book of books) { //Loop through each book and extract the title, price, and product link.
    var title = textFromEl(book,"h3", "textContent"), price = +textFromEl(book,".price_color", "textContent").replace("£",""), link =  textFromEl(book,"a", "href");
    collection.push({price,title,link}); //add extracted data to our book collection
  }
  console.log(collection); })(); //view the collection of books in the browser console.

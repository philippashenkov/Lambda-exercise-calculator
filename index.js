const express = require("express")
const app = express()
 
const PORT = process.env.PORT || 3000
app.use(express.json())

const priceCalculation = (langType, mimetype="none"   , count) => {
  let price = 0;

  price +=
  langType === "ru" || langType === "ua"
      ? count * 0.05
      : count * 0.12;

  if (price < 50 && (langType === "ru" || langType === "ua"))
    price = 50;

  if (price < 120 && langType === "en") 
  price = 120;

  const expectedDocType = mimetype !=="doc" && mimetype !== "docx" && mimetype !== "rtf"
  if (expectedDocType) 
  price *= 1.2

  return price;
};

/*
{
	"language": "en",
	"mimetype": "jpg",
	"count": 10000
}
*/
app.post("/neworder",  (req, res) => {
  const newOrder = req.body;
  const price = priceCalculation(
    newOrder.language,
    newOrder.mimetype,
    newOrder.count
  );
  console.log(newOrder, price)
  res.json({price});
});

const start = async () => {
	try {
		app.listen(PORT, () => {
			console.log(`Server has been started at port ${PORT}.\n`)
		})
	} catch (e) {
		console.log(e)
	}
}

start()
var express = require('express');
var FlashCardDeck = require('../models/flashCardDeck');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  FlashCardDeck.find()
    .then((flashCardDecks) => {      
      
      res.render('index', { flashCardDecks });
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});

router.post('/createDeck', function(req, res, next) {
  const name = req.body.deckName;
  const createDate = Date.now();

  var flashCardDeck = new FlashCardDeck({
    name: name, 
    flashCards : [],
    createDate: Date.now()
  });
  console.log(`Adding a new task ${name} - createDate ${createDate}`)

  flashCardDeck.save()
      .then(() => { 
        console.log(`Added new flash card deck ${name} - createDate ${createDate}`)        
        res.redirect('/'); })
      .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong.');
      });
});

router.post('/addFlashCard/:_id', function(req, res) {
  const {cardQuestion, cardAnswer} = req.body;
  FlashCardDeck.findById(req.params._id)
      .then((deck) => { 
        const index = deck.flashCards.length;
        const updatedFlashCards = [...deck.flashCards, { question: cardQuestion, answer: cardAnswer, index} ];
        deck.flashCards = updatedFlashCards;
        deck.save()
        .then( () => {
          res.redirect(`/deck/${req.params._id}/?index=${index}`);
        } )
        .catch( (err) => console.log(err))
      })
      .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong.');
      });
});

router.get('/deck/:_id', function(req, res){
  const id = req.params._id;
  const index = parseInt(req.query.index);

  FlashCardDeck.findById(id)
  .then((flashCardDeck) =>{
    const currentCard = flashCardDeck.flashCards.find( card => card.index === index);
    res.render('deck', {flashCardDeck, currentCard, index})
  })
  .catch((error) =>{
    console.log("there was an error...");
    res.status(500).send();
  })
})

router.get('/flashcard/edit/:_id', function(req, res) {
  const id = req.params._id;
  const index = parseInt(req.query.index);
  FlashCardDeck.findById(id)
  .then((flashCardDeck) =>{
    const currentCard = flashCardDeck.flashCards.find( card => card.index === index);
    res.send(
      `
      <form class='form p-4' action='/edit/flashcard/${id}/${index}' method='POST'>
        <div class='from-group'>
          <label class='h4'>Question</label>
          <input class='form-control' type="text" name="cardQuestion" value='${currentCard.question}'>
        </div>
        <div class="form-group">
          <label class='h4'>Answer</label>
          <input class='form-control' type="text" name="cardAnswer" value='${currentCard.answer}'>
        </div>
        <button class="btn">Submit</button>
        <a class='btn' href="/deck/${flashCardDeck._id}/?index=${index}" >Cancel</button>
    </form> 
      `
    )
  })
  .catch((error) =>{
    console.log("there was an error...");
    res.status(500).send();
  })

})

router.post('/edit/flashcard/:_id/:index', function(req, res) {
  const {cardQuestion, cardAnswer} = req.body;
  const id = req.params._id;
  const index = parseInt(req.params.index);
  const updatedCard = {question: cardQuestion, answer: cardAnswer, index }
  FlashCardDeck.findById(id)
      .then((deck) => {
        deck.flashCards = [...deck.flashCards.slice(0, index), updatedCard,...deck.flashCards.slice(index + 1, deck.flashCards.length)];
        deck.save()
        .then( () => {
          res.redirect(`/deck/${req.params._id}/?index=${index}`);
        } )
        .catch( (err) => console.log(err))
      })
      .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong.');
      });
});

router.get('/edit/deck/:_id', function(req, res){
  FlashCardDeck.findById(req.params._id)
  .then((deck) =>{
    const deckName = deck.name;
    const deckID = deck._id;
    res.render('edit', {deckName, deckID})
  })
  .catch((err) =>{
    res.status(500).send()
  })
})

router.put('/deck/:_id', function(req, res){
  FlashCardDeck.findByIdAndUpdate(req.params._id, {name: req.body.deckName})
  .then(()=>{
    res.set("HX-Redirect", '/').send();
  })
  .catch((err)=>{
    res.status(500).send()
  })
})

router.delete('/deck/:_id', function(req, res){
  FlashCardDeck.findByIdAndDelete(req.params._id)
  .then(() =>{
    res.set("HX-Redirect", '/').send();
  })
  .catch((err) =>{
    res.status(500).send()
  })
})

router.delete('/flashcard/:_id/:index', function(req, res) {
  const id = req.params._id;
  const index = parseInt(req.params.index);
  FlashCardDeck.findById(id)
      .then((deck) => {
        deck.flashCards = deck.flashCards.filter((item, idx) => idx !== index);
        deck.flashCards.forEach( (item, i) => item.index = i);
        deck.save()
        .then( () => {
          // redirects
          res.set("HX-Redirect", `/deck/${id}/?index=${index}`).send();
        } )
        .catch( (err) => console.log(err))
      })
      .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong.');
      });
});



module.exports = router;

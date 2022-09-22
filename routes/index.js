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

// router.post('/completeTask', function(req, res, next) {
//   console.log("I am in the PUT method")
//   const taskId = req.body._id;
//   const completedDate = Date.now();

//   Task.findByIdAndUpdate(taskId, { completed: true, completedDate })
//     .then(() => { 
//       console.log(`Completed task ${taskId}`)
//       res.redirect('/'); }  )
//     .catch((err) => {
//       console.log(err);
//       res.send('Sorry! Something went wrong.');
//     });
// });


// router.post('/deleteTask', function(req, res, next) {
//   const taskId = req.body._id;
//   const completedDate = Date.now();
//   Task.findByIdAndDelete(taskId)
//     .then(() => { 
//       console.log(`Deleted task $(taskId)`)      
//       res.redirect('/'); }  )
//     .catch((err) => {
//       console.log(err);
//       res.send('Sorry! Something went wrong.');
//     });
// });


module.exports = router;

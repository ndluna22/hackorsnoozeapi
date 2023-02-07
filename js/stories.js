"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if a user is logged in, show favorite/not-favorite star
  //const showStar = Boolean(currentUser); EDIT*****

  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Make favorite/not-favorite star for story    //EDIT****

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
} //****EDIT

//ADDED BELOW FOR 2B
//This is called when users submit the form
//This function gets data from the form addStory
//puts new story on the page

async function addStory() {
  res = await addStory();
  let newTitle = document.createElement("div");
  newTitle.setAttribute("id", newTitle);
  $addStory.append(newTitle); //

  let newAuthor = document.createElement("div");
  newAuthor.setAttribute("id", newAuthor);
  $addStory.append(newAuthor);

  let newURL = document.createElement("div");
  newURL.setAttribute("id", newURL);
  $addStory.append(newURL);

  formData = res.data;
  $addStory.append(formData);
}

//Handle Submitted New Story *****EDIT******

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  // grab all info from form
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  // hide the form and reset it
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);

function putUserStoriesOnPage() {
  //****EDIT***** */
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

//Part3 Favorite Stories
async function favoriteStory() {
  res = await getStories();
  formData = res.data;
  storyList.append(formData);
}

// function putFavoritesListOnPage() {
//   console.debug("putFavoritesListOnPage");

//   $favoritedStories.empty();

//   if (currentUser.favorites.length === 0) {
//     $favoritedStories.append("<h5>No favorites added!</h5>");
//   } else {
//     // loop through all of users favorites and generate HTML for them
//     for (let story of currentUser.favorites) {
//       const $story = generateStoryMarkup(story);
//       $favoritedStories.append($story);
//     }
//   }

//   $favoritedStories.show();
// }

//Part4 Remove Story:  EDIT******
async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

/** Make delete button HTML for story */ //EDIT****

// function getDeleteBtnHTML() {
//   return `
//       <span class="trash-can">
//         <i class="fas fa-trash-alt"></i>
//       </span>`;
// }
function removeStoryButton() {
  console.debug("removeStoryButton");
  $removeStory.hide(); //Submit button disappearsd
  $removeStory.show(); //ADDED THIS to show submit Button
  //$submitForm.text(`${currentUser.username}`).show();
}

$submitStory.on("click", addStoryButton);

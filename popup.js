document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("addEventButton")
    .addEventListener("click", function () {
      addEvent();
    });
  loadEvents();
});

function loadEvents() {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";

  chrome.storage.sync.get("events", function (data) {
    const events = data.events || [];

    events.forEach(function (event, index) {
      const li = document.createElement("li");
      li.innerHTML = `${event} <button class="editButton" data-index="${index}">수정</button> <button class="deleteButton" data-index="${index}">삭제</button>`;

      eventList.appendChild(li);

      const editButton = li.querySelector(".editButton");
      editButton.addEventListener("click", function () {
        editEvent(index);
      });

      const deleteButton = li.querySelector(".deleteButton");
      deleteButton.addEventListener("click", function () {
        deleteEvent(index);
      });
    });
  });
}

function addEvent() {
  const eventInput = document.getElementById("eventInput");
  const event = eventInput.value.trim();

  if (event !== "") {
    chrome.storage.sync.get("events", function (data) {
      const events = data.events || [];
      events.push(event);

      chrome.storage.sync.set({ events: events }, function () {
        loadEvents();
        eventInput.value = "";
      });
    });
  }
}

function editEvent(index) {
  chrome.storage.sync.get("events", function (data) {
    const events = data.events || [];

    if (index >= 0 && index < events.length) {
      const newEvent = prompt("수정할 내용을 입력하세요", events[index]);

      if (newEvent !== null) {
        events[index] = newEvent;

        chrome.storage.sync.set({ events: events }, function () {
          loadEvents();
        });
      }
    }
  });
}

function deleteEvent(index) {
  chrome.storage.sync.get("events", function (data) {
    const events = data.events || [];

    if (index >= 0 && index < events.length) {
      events.splice(index, 1);

      chrome.storage.sync.set({ events: events }, function () {
        loadEvents();
      });
    }
  });
}

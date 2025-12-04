$(document).ready( function (){

  // ----------- SAMPLE COURSE DATA SECTION -----------
  //              Sample course data
  const courses = [
    { id: 1, title: "Intro to Math", category: "math", credits: 3, instructor: "Smith", schedule: "M/W 9-10 AM" },
    { id: 2, title: "Chemistry 101", category: "science", credits: 4, instructor: "Johnson", schedule: "T/Th 11-12 AM" },
    { id: 3, title: "Programming Basics", category: "cs", credits: 3, instructor: "Lee", schedule: "M/W 1-2 PM" },
    { id: 4, title: "Physics 101", category: "science", credits: 4, instructor: "Brown", schedule: "T/Th 2-3 PM" }
  ];
  // ----------- END SAMPLE COURSE DATA SECTION -----------


  // ----------- RENDER COURSE CATALOG SECTION -----------
  //                Render course catalog
  const renderCatalog = filterCourses =>{
    const catalog = $('#catalog');
    catalog.empty();

    if(filterCourses.length === 0){
      catalog.html('<p>No courses found.</p>');
      return;
    }

    for(const c of filterCourses){
      const card = ` <div class="course-card" data-id="${c.id}">
      <h4>${c.title}</h4>
      <p>${c.credits} credits | ${c.instructor}</p>
       <button class="btn btn-sm btn-primary view-details" data-id="${c.id}">View Details</button>
      </div>`;
      catalog.append(card);
    }
  };
  // ----------- END RENDER COURSE CATALOG SECTION -----------


  // ----------- SHOW COURSE DETAIL PANEL SECTION -----------
  //                Show course details panel
  const renderDetails = (id, cardElement) => {
    const course = courses.find(c => c.id === id);

    // Build dynamic box
    const detailHtml = `
      <div class="course-detail-box border p-3 mt-2">
        <h4>${course.title}</h4>
        <p><strong>Credits:</strong> ${course.credits}</p>
        <p><strong>Instructor:</strong> ${course.instructor}</p>
        <p><strong>Schedule:</strong> ${course.schedule}</p>
        <button class="btn btn-success btn-sm add-timetable" data-id="${course.id}">Add to Timetable</button>
        <button class="btn btn-outline-secondary btn-sm add-compare" data-id="${course.id}">Add to Compare</button>
      </div>
    `;

    // Remove any existing open detail boxes before inserting new one
    $(".course-detail-box").slideUp(200, function () { $(this).remove(); });

    // Insert under the clicked card
    $(cardElement).after(detailHtml);

    // Animate reveal
    $(cardElement).next(".course-detail-box").hide().slideDown();
  };

  // ----------- END SHOW COURSE DETAIL PANEL SECTION -----------


  // ----------- SEARCH AND FILTER COURSE SECTION -----------
  //                Search and filter function
  const filterCourse = () =>{
    const keyword = $('#search-bar').val().toLowerCase();
    const category = $('#category-filter').val();

    const filtered = courses.filter(c => {
      const matchesKeyword = keyword === "" || c.title.toLowerCase().includes(keyword);
      const matchesCategory = category === "" || c.category === category;
      return matchesKeyword && matchesCategory;
    });//end filtered

    renderCatalog(filtered);
  };
  // ----------- END SEARCH AND FILTER COURSE SECTION -----------


  // Event listeners
  $('#search-bar').on('input', filterCourse);
  $('#category-filter').on('change', filterCourse);

  // Click "View Details" button
  $(document).on('click', '.view-details', function() {
    const id = $(this).data("id");
    const cardElement = $(this).closest(".course-card");

    // Check if THIS card already has details open
    const existingBox = cardElement.next(".course-detail-box");

    // If already open -> close and reset button text
    if (existingBox.length > 0) {
        existingBox.slideUp(200, function () { $(this).remove(); });
        $(this).text("View Details");
        return;
    }

    // Otherwise close any other open boxes and reset their buttons
    $(".course-detail-box").slideUp(200, function () { $(this).remove(); });
    $(".view-details").text("View Details");

    // Change this clicked button text to "Hide"
    $(this).text("Hide");

    // Now show new details
    renderDetails(id, cardElement);
  });



  // ----------- ADD COURSE TO TIMETABLE SECTION ----------- 
  $(document).on("click", ".add-timetable", function () {
    const courseId = $(this).data("id");
    const course = courses.find(c => c.id === courseId);

    // Extract schedule information
    const schedule = course.schedule; // e.g. "M/W 9-10 AM"
    
    // Split into days & time
    // THIS BLOCK WAS REPLACED
    const parts = schedule.split(" ");
    const daysStr = parts[0];     // "M/W"
    const timeRange = parts[1];   // "9-10"
    const period = parts[2];      // "AM" or "PM"

    // Split the days
    const days = daysStr.split("/");

    // Extract the start hour
    let hour = timeRange.split("-")[0] + " " + period; // "9 AM", "1 PM", etc.

    // Map days to index
    const dayMap = { "M": 0, "T": 1, "W": 2, "Th": 3, "F": 4 };

    days.forEach(day => {
      const dayIndex = dayMap[day];

      // Find matching slot
      const slot = $(`.time-slot[data-day="${dayIndex}"][data-hour="${hour}"]`);

      if (slot.length > 0) {
        // Prevent duplicate block
        if (slot.find(".course-block").length === 0) {
          
          slot.append(`
            <div class="course-block">
              ${course.title}
            </div>
          `);

        } else {
          alert("This time slot is already filled!");
        }
      }
    });
  });
  // ----------- END ADD COURSE TO TIMETABLE SECTION -----------

  
  // ----------- REMOVE COURSE FROM TIMETABLE (CLICK ON BLOCK) SECTION -----------
  $(document).on("click", ".course-block", function () {
    const confirmed = confirm("Remove this course from the timetable?");
    if (confirmed) {
      $(this).fadeOut(200, function () {
        $(this).remove(); // uses .remove() as required
      });
    }
  });
  // ----------- END REMOVE COURSE FROM TIMETABLE (CLICK ON BLOCK) SECTION -----------


  // ----------- ADD COURSE TO COMPARISON PANEL SECTION -----------
  $(document).on("click", ".add-compare", function () {
    const courseId = $(this).data("id");
    const course = courses.find(c => c.id === courseId);

    const tableBody = $("#comparison-table tbody");

    // Prevent duplicates
    if (tableBody.find(`tr[data-id="${courseId}"]`).length > 0) {
      alert("This course is already in the comparison table!");
      return;
    }

    // Create the row
    const row = `
      <tr data-id="${courseId}">
        <td>${course.title}</td>
        <td>${course.credits}</td>
        <td>${course.instructor}</td>
        <td>${course.schedule}</td>
      </tr>
    `;

    tableBody.append(row); // Add the new row

    // Show comparison panel with animation
    $("#comparison-panel").slideDown(200);
  });
  // ----------- END ADD COURSE TO COMPARISON PANEL SECTION -----------


  // ----------- REMOVE COURSE FROM COMPARISON PANEL SECTION -----------
  $(document).on("click", "#comparison-table tbody tr", function () {
    const confirmed = confirm("Remove this course from comparison?");
    if (!confirmed) return;

    $(this).fadeOut(200, function () {
      $(this).remove();

      // Hide comparison panel if empty
      const tableBody = $("#comparison-table tbody");
      if (tableBody.children().length === 0) {
        $("#comparison-panel").slideUp(200);
      }
    });
  });
  // ----------- END REMOVE COURSE FROM COMPARISON PANEL SECTION -----------


  // Initial Render (all courses
  renderCatalog(courses)


  // ----------- GENERATED TIMETABLE GRID SECTION -----------
  const generateTimetableGrid = () => {
    const grid = $("#timetable-grid");
    grid.empty();

    // 5 days (Mon–Fri), 6 time slots as example (9AM–2PM)
    const hours = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM"];

    for (let h = 0; h < hours.length; h++) {
      for (let d = 0; d < 5; d++) {
        grid.append(`
          <div class="time-slot" data-day="${d}" data-hour="${hours[h]}">
            ${hours[h]}
          </div>
        `);
      }
    }
  };
  // ----------- END GENERATED TIMETABLE GRID SECTION -----------

  // Call the function to build the grid
  generateTimetableGrid();


  // -----------  ANIMATED NAVIGATION MENU TOGGLE SECTION -----------
  let collapseTimeout;

  function hideAnimatedMenu() {
    const menu = $("#animated-menu");
    if (menu.is(":visible")) {
      menu.slideUp(500, function () {
        $(".animated-link").css({ left: "-20px", opacity: 0 });
      });
    }
  }

  $(document).on("click", "#animated-menu .animated-link", function () {
    hideAnimatedMenu();
  });


  // cancel closing if mouse comes back in
  $("#animated-menu").on("mouseenter", function () {
    clearTimeout(collapseTimeout);
  });

  // auto-close a bit after mouse leaves
  $("#animated-menu").on("mouseleave", function () {
    collapseTimeout = setTimeout(function () {
      const menu = $("#animated-menu");
      menu.slideUp(500, function () {
        // reset link animation state
        $(".animated-link").css({ left: "-20px", opacity: 0 });
      });
    }, 150); // delay in ms; tweak if you like
  });

  $(".navbar").on("mouseleave", function () {
    collapseTimeout = setTimeout(function () {
      hideAnimatedMenu();
    }, 500);
  });


  $(document).on("click", "#menu-toggle", function () {
    const menu = $("#animated-menu");

    // Toggle menu visibility
    menu.slideToggle(300, function () {
      // If menu is now visible, animate the links
      if (menu.is(":visible")) {
        $(".animated-link").each(function (index) {
          $(this)
            .delay(index * 150)
            .animate({ left: "0px", opacity: 1 }, 300);
        });
      } else {
        // Reset link positions when hiding
        $(".animated-link").css({ left: "-20px", opacity: 0 });
      }
    });
  });
  // ----------- END ANIMATED NAVIGATION MENU TOGGLE SECTION -----------

});// END READY
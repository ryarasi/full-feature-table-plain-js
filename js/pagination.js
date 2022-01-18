// Pagination Constants
const pageSize = 10;
let paginationMethodFirstTime = true;

/*
 * This initializes all the constants needed to generate the custom pagination controls
 * and the nexports it inside an object that is used everywhere else
 */
function initializePaginationConstants(gridOptions) {
  // Getting the data on current page and total pages from ag-grid
  let currentPage = gridOptions.api.paginationGetCurrentPage();
  let totalPages = gridOptions.api.paginationGetTotalPages();
  // Creating the elements needed for custom pagination control
  // Creating the buttons
  const paginationControls = document.createElement("span");
  paginationControls.setAttribute("id", "pagination-controls");
  const firstPageButton = document.createElement("button");
  const previousPageButton = document.createElement("button");
  const pageNumberControls = document.createElement("span");
  pageNumberControls.setAttribute("id", "pagination-number-controls");
  const nextPageButton = document.createElement("button");
  const lastPageButton = document.createElement("button");

  // Declaring methods needed for the buttons in the custom paginatiton controls

  function goToPage(number) {
    gridOptions.api.paginationGoToPage(number);
  }
  function goToFirstPage() {
    gridOptions.api.paginationGoToFirstPage();
  }
  function goToLastPage() {
    gridOptions.api.paginationGoToLastPage();
  }
  function goToNextPage() {
    gridOptions.api.paginationGoToNextPage();
  }
  function goToPreviousPage() {
    gridOptions.api.paginationGoToPreviousPage();
  }
  const paginationConstants = {
    currentPage,
    totalPages,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    paginationControls,
    firstPageButton,
    previousPageButton,
    pageNumberControls,
    nextPageButton,
    lastPageButton,
  };
  return paginationConstants;
}
function initializePaginationControlButtons(paginationConstants) {
  const {
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    firstPageButton,
    previousPageButton,
    nextPageButton,
    lastPageButton,
  } = paginationConstants;

  // Initializing the buttons with click methods, styling etc.
  firstPageButton.addEventListener("click", function () {
    goToFirstPage();
  });
  firstPageButton.setAttribute("class", "page-button");
  firstPageButton.innerHTML = `<i class="fas fa-angle-double-left"></i>`;

  previousPageButton.addEventListener("click", function () {
    goToPreviousPage();
  });
  previousPageButton.setAttribute("class", "page-button");
  previousPageButton.innerHTML = `<i class="fas fa-angle-left"></i>`;

  nextPageButton.addEventListener("click", function () {
    goToNextPage();
  });
  nextPageButton.setAttribute("class", "page-button");
  nextPageButton.innerHTML = `<i class="fas fa-angle-right"></i>`;

  lastPageButton.addEventListener("click", function () {
    goToLastPage();
  });
  lastPageButton.setAttribute("class", "page-button");
  lastPageButton.innerHTML = `<i class="fas fa-angle-double-right"></i>`;
}

function addAllPagesToPaginationControl(paginationConstants) {
  // If pages are less than or equal to 5 we create the controls with all buttons fully visible
  const { totalPages, currentPage, pageNumberControls } = paginationConstants;
  for (let i = 0; i < totalPages; i++) {
    const tempButton = document.createElement("button");
    tempButton.addEventListener("click", function () {
      goToPage(i);
    });
    tempButton.innerHTML = i + 1;
    if (currentPage == i) {
      tempButton.setAttribute("class", "active-page-button page-button");
    } else [tempButton.setAttribute("class", "page-button")];
    pageNumberControls.appendChild(tempButton);
  }
}

/*
 * If no. of pages is greater than 5, we constrain the buttons so it fits neatly
 */
function compressPagesAndAddtoPaginationControl(paginationConstants) {
  /*
   * We have a total of 5 dedicated page buttons in the pagination control, besides the next/prev first/last buttons
   * These dedicated buttons are going to have dynamic labels based on which page we're in. Hence the multiple if/else conditions
   * Because the dynamic labels would have to change depending on whether the current page is close to the first/last pages
   * Remember that page numbers are zero-indexed, so first page has index of 0
   */

  const { currentPage, totalPages, pageNumberControls } = paginationConstants;

  if (currentPage >= 2) {
    // If the ecurrent page is greater than 2, we add the first previous to previous page (for eg. if current page is 3, we add page 1)
    const secondPreviousLabeledPageButton = document.createElement("button");
    secondPreviousLabeledPageButton.setAttribute("class", "page-button");
    secondPreviousLabeledPageButton.innerHTML = currentPage - 1;
    secondPreviousLabeledPageButton.addEventListener("click", function () {
      goToPage(currentPage - 2);
    });

    // Adding spacer between the buttons for first/previous pages and the dedicated page buttons
    const initialSpacer = document.createElement("span");
    initialSpacer.innerHTML = "...";
    pageNumberControls.appendChild(initialSpacer);
    pageNumberControls.appendChild(secondPreviousLabeledPageButton);
  }

  if (currentPage >= 1) {
    // If the current page is greater than 1, we add the page right before the current page with this
    const previousLabeledPageButton = document.createElement("button");
    previousLabeledPageButton.setAttribute("class", "page-button");
    previousLabeledPageButton.innerHTML = currentPage;

    previousLabeledPageButton.addEventListener("click", function () {
      goToPage(currentPage - 1);
    });
    pageNumberControls.appendChild(previousLabeledPageButton);
  }

  // Adding the dedicated page button for the current page
  const currentPageLabeledButton = document.createElement("button");
  currentPageLabeledButton.setAttribute(
    "class",
    "page-button active-page-button "
  );
  currentPageLabeledButton.innerHTML = currentPage + 1;
  currentPageLabeledButton.addEventListener("click", function () {
    goToPage(currentPage);
  });
  pageNumberControls.appendChild(currentPageLabeledButton);

  if (currentPage <= totalPages - 2) {
    // If the current page is more than 2 pages before the last page, we add the page immediately after the current page
    const nextLabeledPageButton = document.createElement("button");
    nextLabeledPageButton.setAttribute("class", "page-button");
    nextLabeledPageButton.innerHTML = currentPage + 2;

    nextLabeledPageButton.addEventListener("click", function () {
      goToPage(currentPage + 1);
    });
    pageNumberControls.appendChild(nextLabeledPageButton);
  }
  if (currentPage <= totalPages - 3) {
    // If the current page is at least 3 pages away, then we add the page next to the next page to current page
    const secondNextLabeledPageButton = document.createElement("button");
    secondNextLabeledPageButton.setAttribute("class", "page-button");
    secondNextLabeledPageButton.innerHTML = currentPage + 3;
    secondNextLabeledPageButton.addEventListener("click", function () {
      goToPage(currentPage + 2);
    });
    pageNumberControls.appendChild(secondNextLabeledPageButton);

    // Adding spacer between the dedicated pages and the next/last page buttons
    const endSpacer = document.createElement("span");
    endSpacer.innerHTML = "...";
    pageNumberControls.appendChild(endSpacer);
  }
}

/*
 * Disabling the previous/next buttons on first/last pages appropriately
 */
function disablePrevNextBasedOnContext(paginationConstants) {
  const {
    currentPage,
    totalPages,
    firstPageButton,
    previousPageButton,
    nextPageButton,
    lastPageButton,
  } = paginationConstants;

  if (currentPage < 1) {
    firstPageButton.classList.add("disabled-button");
    previousPageButton.classList.add("disabled-button");
  } else {
    firstPageButton.classList.remove("disabled-button");
    previousPageButton.classList.remove("disabled-button");
  }

  if (totalPages > 1 && currentPage >= totalPages - 1) {
    nextPageButton.classList.add("disabled-button");
    lastPageButton.classList.add("disabled-button");
  } else {
    nextPageButton.classList.remove("disabled-button");
    lastPageButton.classList.remove("disabled-button");
  }
}

/*
 * Modify the built in pagination controls
 */
function modifyBuiltInPaginationControl() {
  const nativeFirstPageButton = document.querySelectorAll("[ref='btFirst']");
  const nativePrevPageButton = document.querySelectorAll("[ref='btPrevious']");
  const nativeNextPageButton = document.querySelectorAll("[ref='btNext']");
  const nativeLastPageButton = document.querySelectorAll("[ref='btLast']");
  nativeFirstPageButton[0]?.remove();
  nativePrevPageButton[0]?.remove();
  nativeNextPageButton[0]?.remove();
  nativeLastPageButton[0]?.remove();
  const paginationSummaryPanel = document.getElementsByClassName(
    "ag-paging-row-summary-panel"
  );
  paginationSummaryPanel[0].prepend("Showing ");
  paginationSummaryPanel[0].append(" rows. Currently on");
  paginationSummaryPanel[0].style.marginRight = "-2px";
  const paginationPageSummaryPanel = document.getElementsByClassName(
    "ag-paging-page-summary-panel"
  );
  paginationPageSummaryPanel[0].style.marginLeft = "0px";
  pageText = document.getElementById("ag-21-start-page");
  pageText.innerHTML = "page";
}

/*
 *  Removing the default pagination controls that ag-grid offers
 */
function resetCustomPaginationControls() {
  const existingPaginationNumberControls = document.getElementById(
    "pagination-number-controls"
  );
  const existPaginationControls = document.getElementById(
    "pagination-controls"
  );
  existingPaginationNumberControls?.remove();
  existPaginationControls?.remove();
}

/*
 * This method implements pagination and applies it as soon as the grid loads
 */
function implementPagination(gridOptions, mobile) {
  if (!mobile) {
    resetCustomPaginationControls();
    // Adding custom pagination controls only on desktop

    paginationConstants = initializePaginationConstants(gridOptions);

    const {
      totalPages,
      paginationControls,
      firstPageButton,
      previousPageButton,
      pageNumberControls,
      nextPageButton,
      lastPageButton,
    } = paginationConstants;

    initializePaginationControlButtons(paginationConstants);
    // Initializing the buttons to the overall pagination controls in different ways based on the no. of pages
    if (totalPages > 1 && totalPages < 6) {
      addAllPagesToPaginationControl(paginationConstants);
    } else {
      compressPagesAndAddtoPaginationControl(paginationConstants);
    }

    // Adding the buttons to the overal controls panel
    paginationControls.appendChild(firstPageButton);
    paginationControls.appendChild(previousPageButton);
    paginationControls.appendChild(pageNumberControls);
    paginationControls.appendChild(nextPageButton);
    paginationControls.appendChild(lastPageButton);

    disablePrevNextBasedOnContext(paginationConstants);
    if (paginationMethodFirstTime) {
      modifyBuiltInPaginationControl();
    }
    var footer = document.getElementById("ag-21");
    footer.prepend(paginationControls); // Add in the custom pagination controls
    paginationMethodFirstTime = false;
  }
}

// Constants
const pageSize = 10;
let paginationMethodFirstTime = true;

function implementPagination(gridOptions) {
  const existPaginationControls = document.getElementById(
    "pagination-controls"
  );
  existPaginationControls?.remove();
  const currentPage = gridOptions.api.paginationGetCurrentPage();
  const totalPages = gridOptions.api.paginationGetTotalPages();
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
  const paginationControls = document.createElement("span");
  paginationControls.setAttribute("id", "pagination-controls");
  const firstPageButton = document.createElement("button");
  const previousPageButton = document.createElement("button");
  const pageNumberControls = document.createElement("span");
  const nextPageButton = document.createElement("button");
  const lastPageButton = document.createElement("button");

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
  if (totalPages > 1 && totalPages < 6) {
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
  } else {
    if (currentPage >= 2) {
      const secondPreviousLabeledPageButton = document.createElement("button");
      secondPreviousLabeledPageButton.setAttribute("class", "page-button");
      secondPreviousLabeledPageButton.innerHTML = currentPage - 1;
      secondPreviousLabeledPageButton.addEventListener("click", function () {
        goToPage(currentPage - 2);
      });
      const initialSpacer = document.createElement("span");
      initialSpacer.innerHTML = "...";
      pageNumberControls.appendChild(initialSpacer);
      pageNumberControls.appendChild(secondPreviousLabeledPageButton);
    }
    if (currentPage >= 1) {
      const previousLabeledPageButton = document.createElement("button");
      previousLabeledPageButton.setAttribute("class", "page-button");
      previousLabeledPageButton.innerHTML = currentPage;

      previousLabeledPageButton.addEventListener("click", function () {
        goToPage(currentPage - 1);
      });
      pageNumberControls.appendChild(previousLabeledPageButton);
    }
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
      const nextLabeledPageButton = document.createElement("button");
      nextLabeledPageButton.setAttribute("class", "page-button");
      nextLabeledPageButton.innerHTML = currentPage + 2;

      nextLabeledPageButton.addEventListener("click", function () {
        goToPage(currentPage + 1);
      });
      pageNumberControls.appendChild(nextLabeledPageButton);
    }
    if (currentPage <= totalPages - 3) {
      const secondNextLabeledPageButton = document.createElement("button");
      secondNextLabeledPageButton.setAttribute("class", "page-button");
      secondNextLabeledPageButton.innerHTML = currentPage + 3;
      secondNextLabeledPageButton.addEventListener("click", function () {
        goToPage(currentPage + 2);
      });
      pageNumberControls.appendChild(secondNextLabeledPageButton);

      const endSpacer = document.createElement("span");
      endSpacer.innerHTML = "...";
      pageNumberControls.appendChild(endSpacer);
    }
  }
  paginationControls.appendChild(firstPageButton);
  paginationControls.appendChild(previousPageButton);
  paginationControls.appendChild(pageNumberControls);
  paginationControls.appendChild(nextPageButton);
  paginationControls.appendChild(lastPageButton);

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
  if (paginationMethodFirstTime) {
    const nativeFirstPageButton = document.querySelectorAll("[ref='btFirst']");
    const nativePrevPageButton =
      document.querySelectorAll("[ref='btPrevious']");
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
  var footer = document.getElementById("ag-21");
  footer.prepend(paginationControls);
  paginationMethodFirstTime = false;
}

function actionCellRenderer(params) {
  let eGui = document.createElement("div");

  let editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some((cell) => {
    return cell.rowIndex === params.node.rowIndex;
  });

  if (isCurrentRowEditing) {
    eGui.innerHTML = `
        <button  
          class="action-button update"
          data-action="update">
               update  
        </button>
        <button  
          class="action-button cancel"
          data-action="cancel">
               cancel
        </button>
        `;
  } else {
    eGui.innerHTML = `
        <i 
          class="action-button edit fas fa-edit"  
          data-action="edit">
              
          </i>
        <i 
          class="action-button delete  fas fa-trash"
          data-action="delete">
             
        </i>
        `;
  }

  return eGui;
}

var gridOptions = {
  suppressClickEdit: true,
  showRowSelection: true,
  rowSelection: "multiple",
  suppressRowDeselection: true,
  suppressRowClickSelection: true,
  pagination: true,
  paginationPageSize: pageSize,
  onCellClicked(params) {
    // Handle click event for action cells
    if (
      params.column.colId === "action" &&
      params.event.target.dataset.action
    ) {
      let action = params.event.target.dataset.action;

      if (action === "edit") {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
        });
      }

      if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data],
        });
      }

      if (action === "update") {
        params.api.stopEditing(false);
      }

      if (action === "cancel") {
        params.api.stopEditing(true);
      }
    }
  },
  onPaginationChanged(params) {
    implementPagination(params);
  },
  onFilterTextBoxChanged() {
    gridOptions.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  },
  onSelectionChanged(params) {
    let selectedNodes = gridOptions.api.getSelectedNodes();
    /*
    If select all was used, then we select only the visible rows...
    First, we detect if the selected rows are more than page size
    */
    if (selectedNodes.length > pageSize) {
      // ...if yes, then only selecting the visible rows
      selectedNodes = gridOptions.api.getRenderedNodes();
    }
    const existingDeleteButton = document.getElementById(
      "delete-selected-rows-button"
    );

    if (selectedNodes.length) {
      if (!existingDeleteButton) {
        var footer = document.getElementById("ag-21");
        const deleteSelectedRowsButton = document.createElement("button");
        deleteSelectedRowsButton.innerHTML = "Delete Selected";
        deleteSelectedRowsButton.setAttribute(
          "id",
          "delete-selected-rows-button"
        );
        deleteSelectedRowsButton.addEventListener("click", function () {
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          gridOptions.api.deselectAll();
        });
        footer.prepend(deleteSelectedRowsButton);
      }
    } else if (selectedNodes.length == 0 && existingDeleteButton) {
      existingDeleteButton.remove();
    }
  },

  onRowEditingStarted: (params) => {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true,
    });
  },
  onRowEditingStopped: (params) => {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true,
    });
  },
  editType: "fullRow",
  columnDefs: [
    {
      field: "",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: "20px",
      editable: false,
      resizable: false,
    },
    { field: "name" },
    { field: "email" },
    { field: "role" },
    {
      headerName: "Actions",
      minWidth: 150,
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: "action",
      resizable: false,
    },
  ],

  defaultColDef: {
    editable: true,
    resizable: true,
  },
};

// Keyboard navigation
// suppressing tabbing away from editing row

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  var gridDiv = document.querySelector("#myGrid");

  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url: "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json",
    })
    .then(function (data) {
      gridOptions.api.setRowData(data);
      implementPagination(gridOptions);
    });
});

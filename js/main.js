/* Constants */
const ApiUrl =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

// Definition for all the columns
const columnDefs = [
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
];

const defaultColDef = {
  editable: true,
  resizable: true,
};

let mobile = true;

// Method to render the cells in the 'Actions' column in the table
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

/* Custom call-back methods for the events in the grid */

function onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === "action" && params.event.target.dataset.action) {
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
}

function onFilterTextBoxChanged() {
  gridOptions.api.setQuickFilter(
    document.getElementById("filter-text-box").value
  );
}

function onSelectionChanged(params) {
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
}

function onRowEditingStarted(params) {
  params.api.refreshCells({
    columns: ["action"],
    rowNodes: [params.node],
    force: true,
  });
}
function onRowEditingStopped(params) {
  params.api.refreshCells({
    columns: ["action"],
    rowNodes: [params.node],
    force: true,
  });
}

/* Passing in all the constants and callback methods to the gridOptions variable 
to initialize ag-grid with*/

var gridOptions = {
  suppressClickEdit: true,
  showRowSelection: true,
  rowSelection: "multiple",
  suppressRowDeselection: true,
  suppressRowClickSelection: true,
  pagination: true,
  paginationPageSize: pageSize,
  onCellClicked,
  onPaginationChanged(params) {
    implementPagination(params, mobile);
  },
  onFilterTextBoxChanged,
  onSelectionChanged,
  onRowEditingStarted,
  onRowEditingStopped,
  editType: "fullRow",
  columnDefs,
  defaultColDef,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  // This checks whether we're in mobile or on desktop. Useful for changing how pagination controls are displayed
  window.mobileCheck = function () {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };
  mobile = window.mobileCheck();

  var gridDiv = document.querySelector("#myGrid");

  // Initializing AgGrid with the gridOptions
  new agGrid.Grid(gridDiv, gridOptions);

  // Fetching data
  agGrid
    .simpleHttpRequest({
      url: ApiUrl,
    })
    .then(function (data) {
      gridOptions.api.setRowData(data);
      implementPagination(gridOptions, mobile); // implementing pagination after initial data load
    });
});

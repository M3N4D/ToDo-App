import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import saveToDo from "@salesforce/apex/ToDoController.saveToDo";

export default class CreateTask extends LightningElement {
  @api targetParent;
  taskTitle;
  dueDate;
  showDueDate = false;
  showSave = false;

  connectedCallback() {
    console.log("####Taret Parent: " + this.targetParent);
    //this.showDueDate = false;
    //this.showSave = false;
  }

  handleOnchange(event) {
    const fieldName = event.target.name;
    if (fieldName === "taskTitle") {
      this.taskTitle = event.target.value;
      console.log("Task title: ", this.taskTitle);

      if (this.taskTitle != "") {
        this.showDueDate = true;
      } else {
        this.showDueDate = false;
      }
    } else if (fieldName === "dueDate") {
      this.dueDate = event.target.value;
      this.dueDate != "" && this.targetParent != true
        ? (this.showSave = true)
        : (this.showSave = false);
    }
  }

  handleClick() {
    console.log("####Button clicked on Child: ");
    saveToDo({ title: this.taskTitle, dueDate: this.dueDate })
      .then((result) => {
        console.log("####Result from saveToDo: " + result);
        if (result === "Success") {
          this.taskTitle = "";
          this.dueDate = "";
          //console.log("####Novo 1: " + result);
          const evt = new ShowToastEvent({
            title: "Success",
            message: "A new Task was Added in your To Do List",
            variant: "success"
          });
          this.dispatchEvent(evt);          
          //inserting refreshApex: bubbleUp an event
          this.dispatchEvent(new CustomEvent("refreshtodo"));

          //check if it's comming from a quickAction: show how to pass a value through event
          if(this.targetParent === true) {
            const selectedEvent = new CustomEvent("closeaction", {
              detail: result
            });
            this.dispatchEvent(selectedEvent);
          }
        }
      })
      .catch((error) => {
        console.log("####Error from saveToDo: " + error);
        const evt = new ShowToastEvent({
          title: "Error",
          message: error.body.message,
          variant: "error"
        });
        this.dispatchEvent(evt);
      });
  }

  @api
  handleParentClick() {
    this.handleClick();
    //console.log("####Button clicked on Parent: ");
  }
}

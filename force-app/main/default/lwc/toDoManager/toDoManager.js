import { LightningElement } from 'lwc';

export default class ToDoManager extends LightningElement {
    refreshToDo(){
      //console.log("####Chegou até aqui: ");
        this.refs.pendingToDo.refreshList();
        this.refs.completedToDo.refreshList();
    }
}
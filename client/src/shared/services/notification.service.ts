import { Injectable, inject } from "@angular/core";
import { LocalNotifications } from "@capacitor/local-notifications";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(){

  }

  register(){
    const registerNotifications = async () => {
      let permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display === 'prompt') {
        permStatus = await LocalNotifications.requestPermissions();
      }
      if (permStatus.display !== 'granted') {
        // throw new Error('User denied permissions!');
      let permStatus = await LocalNotifications.checkPermissions();
        permStatus = await LocalNotifications.requestPermissions();

      }
    }

    const getDeliveredNotifications = async () => {
      const notificationList = await LocalNotifications.getDeliveredNotifications();
    }

    const clearDeliveredNotifications = async () => {
      await LocalNotifications.removeAllDeliveredNotifications();
    }

    registerNotifications();
    getDeliveredNotifications();
    clearDeliveredNotifications();
  }

  async setBasicNotification(title:string, body: string, id?: number){
    await LocalNotifications.schedule({
      notifications:[{
      id: id ? id : Math.random(),
      title,
      body
      }]
    });
  }


}

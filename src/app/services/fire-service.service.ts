import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { WhereFilterOp, collection } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireServiceService {
  user:any;
  destiItem:any;
  desti:any;

  constructor(
    public auth: AngularFireAuth, 
    public firestore: AngularFirestore
  ) { 
    this.usersCollection = firestore.collection<User>('users');
    this.items = this.usersCollection.valueChanges();
    auth.authState.subscribe(user => {
      this.user = user;
    });

    this.destinationCollection = firestore.collection<Destination>('tourist_spots', (ref) =>ref.orderBy('estName').limit(50));
    this.destiItems = this.destinationCollection.valueChanges();
  }

  private usersCollection: AngularFirestoreCollection<User>;
  items: Observable<User[]>;
  addUserItem(item: User) { 
    this.usersCollection.add(item);
  }



  private destinationCollection: AngularFirestoreCollection<Destination>;
  destiItems: Observable<Destination[]>;
  addDestinationItem(destiItem: Destination) {
    this.destinationCollection.add(destiItem);
  }

  getAuth(){
    return this.auth;
  }
  loginWithEmail(data:any) {
    return this.auth.signInWithEmailAndPassword(data.email, data.password);
  }
  signup(data:any) {
    return this.auth.createUserWithEmailAndPassword(data.email, data.pword);
  }
  saveDetails(data:any) {
    return this.firestore.collection("users").doc(data.uId).set(data);
  }
  saveTouristDestion(data:any){
    return this.firestore.collection("tourist_spots").doc(data.tourismID).set(data);
  }
  savePost(data:any){
    return this.firestore.collection("posts").doc(data.postID).set(data);
  }
  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }


  getDocumentCount(collectionName: string): Promise<number> {
    const collectionRef = this.firestore.collectionGroup(collectionName);

    return collectionRef.get().toPromise().then((querySnapshot) => {
      return querySnapshot!.size; // Get the number of documents in the collection
    });
  }

  async getTspotDocument(value: any): Promise<any> {
    const collectionRef = this.firestore.collection("tourist_spots");

    // Create a query that counts documents based on the specified condition
    const query = collectionRef.ref
      .where('estName', '==', value)
      .limit(1); // Limit the query to a single document

    // Perform the query and get the result
    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      // No matching documents found, return null or handle it as needed
      return null;
    } else {
      // Extract and return the first document from the query
      const firstDocument = querySnapshot.docs[0].data();
      return firstDocument;
    }
  }

  async getHomeDocuments(value: any): Promise<any> {
    const collectionRef = this.firestore.collection("posts");

    // Create a query that counts documents based on the specified condition
    const query = collectionRef.ref
      .where('category', '==', value)
      .limit(10); // Limit the query to a single document

    // Perform the query and get the result
    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      // No matching documents found, return null or handle it as needed
      return null;
    } else {
      // Extract and return the first document from the query
      const natureList = querySnapshot.docs;
      return natureList;
    }
  }

  async getPhotoDocument(value: any): Promise<any> {
    const collectionRef = this.firestore.collection("post_photos");

    // Create a query that counts documents based on the specified condition
    const query = collectionRef.ref
      .where('postID', '==', value)
      .limit(10); // Limit the query to a single document

    // Perform the query and get the result
    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      // No matching documents found, return null or handle it as needed
      return null;
    } else {
      // Extract and return the first document from the query
      const photo = querySnapshot.docs[0].data();
      return photo;
    }
  }

  async getPostDocument(value: string): Promise<any> {
    const collectionRef = this.firestore.collection("posts");

    // Create a query that counts documents based on the specified condition
    const query = collectionRef.ref
      .where('postID', '==', value)
      .limit(1); // Limit the query to a single document

    // Perform the query and get the result
    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      alert("Document Not Found");
      // No matching documents found, return null or handle it as needed
      return null;
    } else {
      // Extract and return the first document from the query
      const post = querySnapshot.docs[0].data();
      return post;
    }
  }
  

  searchResults: any[] = [];



  getAllTouristDestinations(){
    return this.destinationCollection;
  }

  getUserDetails(data:any) {
    return this.firestore.collection("users").doc(data.uId).valueChanges();
  }
  getAllUsername(){
    return this.firestore.collection("users").doc().valueChanges();
  }
  getCurrentUser(){
    return this.user;
  }
  getAllUsers(){
    return this.usersCollection;
  }


  getDocumentCounter(): Observable<any> {
    const collectionRef = this.firestore.collection("counter");
    return collectionRef.doc("counts").valueChanges();
  }
  updateTSPotCount(data: any): Promise<void> {
    return this.firestore.collection("counter").doc("counts").update(data);
  }


  /* getOneTSpot(documentId:string): Observable<any> {
    const documentRef = this.firestore.collection("touristSpots").doc().where('estName', '==', '');
    return documentRef.valueChanges();
  } */

}


export interface User{

}

export interface Destination{

}


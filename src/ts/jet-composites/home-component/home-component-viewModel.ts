"use strict";

import * as ko from "knockout";
import componentStrings = require("ojL10n!./resources/nls/home-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import "ojs/ojknockout";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import BufferingDataProvider = require("ojs/ojbufferingdataprovider");
import NumberRangeValidator = require("ojs/ojvalidator-numberrange");
import AsyncRegExpValidator = require('ojs/ojasyncvalidator-regexp');
import RequiredValidator = require('ojs/ojvalidator-required');
import { KeySetImpl } from "ojs/ojkeyset";
import { ojButton } from "ojs/ojbutton";
import { pickFiles } from "ojs/ojfilepickerutils";

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    messageText: ko.Observable<string>;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };

    loader: ko.Observable<boolean>;
    userData: ko.Observable<{ name: string; username: string; roleValue: string; email: string; mobileNo: string;  profilePic: string ; OrgName:string; Pwd:string}>;
    nameValidator: ko.ObservableArray<any>;
    orgValidator: ko.ObservableArray<any>;
    profilePic = ko.observable('');
    usernameValidator: ko.ObservableArray<any>;
    emailValidator: ko.ObservableArray<any>;
    mobileValidator: ko.ObservableArray<any>;
    roleValidator: ko.ObservableArray<any>;
    selectedValues: ko.ObservableArray<string>; // Stores selected 'value'
    selectedIds: ko.Computed<string>; // Stores computed 'id' values
    optionsList: ko.ObservableArray<{ id: string; value: string; name: string }>;
    multiSelectDataProvider: ArrayDataProvider<string, { id: string; value: string; name: string }>;
    selectedItems = ko.observable({
        row: new KeySetImpl(),
        column: new KeySetImpl()
    });
    selectedTableRowsArray = ko.observableArray<number>([]); // Ensure correct type
    selectedColumnsArray = ko.observableArray<string>([]);
    isSearchIconClicked = ko.observable<boolean>(false);
    roledata: ArrayDataProvider<string, { id: string; value: string; name: string }>;
    profilePicSrc: ko.PureComputed<string>;

    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { "description": "Web Component Startup - Waiting for data" };
        this.busyResolve = busyContext.addBusyState(options);
        this.composite = context.element;
        this.messageText = ko.observable("Login Page");
        this.properties = context.properties;
        this.res = componentStrings["home-component"];
        this.selectedValues = ko.observableArray<string>(["HTML", "CSS"]);
        this.loader = ko.observable(false);
        this.profilePicSrc = ko.pureComputed(() => {
            const pic = this.userData()?.profilePic;
            return pic ? pic : '../../../assets/images/profile-new.png';
        });
        this.selectProfileListener = this.selectProfileListener.bind(this);
        this.selectProfileFiles = this.selectProfileFiles.bind(this);
        const rolesList = [
            { id: "1", value: "Admin", name: "Admin" },
            { id: "2", value: "Approver", name: "Approver" },
            { id: "3", value: "Designer", name: "Designer" },
        ];

    

        this.roledata = new ArrayDataProvider(rolesList, { keyAttributes: "value" });


        this.userData = ko.observable({
            name: "",
            username: "",
            roleValue: "",
            email: "",
            mobileNo: "",
            profilePic: "",
            OrgName:"",
            Pwd:""

        });

        // Define AsyncRegExpValidator for Name (Only letters and spaces)
        this.nameValidator = ko.observableArray([
            new RequiredValidator({
                hint: "Name is required.",
                messageSummary: "Required",
                messageDetail: "Please enter a name."
            }),
            new AsyncRegExpValidator({
                pattern: "^[A-Za-z\\s]+$",  // Use string instead of RegExp object
                hint: "Only alphabets and spaces allowed.",
                messageSummary: "Invalid Name",
                messageDetail: "Name should contain only letters and spaces."
            })
        ]);

           // Define AsyncRegExpValidator for Name (Only letters and spaces)
           this.orgValidator = ko.observableArray([
            new RequiredValidator({
                hint: "Name is required.",
                messageSummary: "Required",
                messageDetail: "Please enter a name."
            }),
            new AsyncRegExpValidator({
                pattern: "^[A-Za-z\\s]+$",  // Use string instead of RegExp object
                hint: "Only alphabets and spaces allowed.",
                messageSummary: "Invalid Name",
                messageDetail: "Name should contain only letters and spaces."
            })
        ]);

        // Define AsyncRegExpValidator for userName (Only letters and spaces)
        this.usernameValidator = ko.observableArray([
            new RequiredValidator({
                hint: "Name is required.",
                messageSummary: "Required",
                messageDetail: "Please enter a name."
            }),
            new AsyncRegExpValidator({
                pattern: "^[A-Za-z\\s]+$",  // Use string instead of RegExp object
                hint: "Only alphabets and spaces allowed.",
                messageSummary: "Invalid Name",
                messageDetail: "Name should contain only letters and spaces."
            })
        ]);

        // Email Validator: Required & Valid Email Format
        this.emailValidator = ko.observableArray([
            new RequiredValidator({
                hint: "Email is required.",
                messageSummary: "Required",
                messageDetail: "Please enter an email address."
            }),
            new AsyncRegExpValidator({
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", // Valid email pattern
                hint: "Enter a valid email (e.g., user@example.com).",
                messageSummary: "Invalid Email",
                messageDetail: "Please enter a valid email address."
            })
        ]);

        // Mobile Validator: Required & Only Numbers (10 Digits)
        this.mobileValidator = ko.observableArray([
            new RequiredValidator({
                hint: "Mobile number is required.",
                messageSummary: "Required",
                messageDetail: "Please enter a mobile number."
            }),
            new AsyncRegExpValidator({
                pattern: "^[0-9]{10}$", // Only 10-digit numbers
                hint: "Enter a valid 10-digit mobile number.",
                messageSummary: "Invalid Mobile Number",
                messageDetail: "Mobile number must be exactly 10 digits."
            })
        ]);

       


             // User Role: Required (Dropdown Selection)
             this.roleValidator = ko.observableArray([
                new RequiredValidator({
                    hint: "Please select a Role.",
                    messageSummary: "Required",
                    messageDetail: "Role selection is mandatory."
                })
            ]);



        this.openUserDialog = this.openUserDialog.bind(this);
        this.closeUserDialog = this.closeUserDialog.bind(this);
        this.saveUser = this.saveUser.bind(this);

        // JSON data is now an observable array
        this.optionsList = ko.observableArray([
            { id: "1", value: "HTML", name: "HTML" },
            { id: "2", value: "CSS", name: "CSS" },
            { id: "3", value: "JS", name: "JS" },
        ]);

        this.multiSelectDataProvider = new ArrayDataProvider(this.optionsList, { keyAttributes: "value" });

        this.selectedIds = ko.pureComputed(() => {
            const selectedArray = Array.from(this.selectedValues());
            if (!selectedArray.length) return "No selection";

            return selectedArray
                .map((val) => {
                    const item = this.optionsList().find((item) => item.value === val);
                    return item ? item.value : null;
                })
                .filter((value) => value !== null)
                .join(", ");
        });

        this.selectedValues.subscribe((newValues) => {
            console.log("Selected Values Updated:", newValues);
        });

        this.busyResolve();
    }

    onStartClick = async (): Promise<void> => {
        try {
            const response = await fetch("http://10.26.1.52:5150/generate-login-url", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            const data = await response.json();
            if (data?.result) {
                window.location.href = data.result;
            }

        } catch (error) {
            console.error("Login Auth Error:", error);
        }
    };

    onRegisterClick = async (): Promise<void> => {
        try {
            const response = await fetch("http://10.26.1.52:5150/generate-login-url", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            const data = await response.json();
            if (data?.result) {
                window.location.href = data.result;
            }

        } catch (error) {
            console.error("Login Auth Error:", error);
        }
    };

    // Open the modal dialog
    openUserDialog(): void {
        (document.getElementById("userDialog") as any).open();
    }

    // Close the modal dialog
    closeUserDialog(): void {
        this.userData({
            name: "",
            username: "",
            roleValue: "",
            email: "",
            mobileNo: "",
            profilePic: "",
            OrgName:"",
            Pwd:""
        });

        (document.getElementById("userDialog") as any).close();
    }

    // reset form
    resetForm(): void {
        this.userData({
            name: "",
            username: "",
            roleValue: "",
            email: "",
            mobileNo: "",
            profilePic: "",
            OrgName:"",
            Pwd:""
        });
    }

    // Save user action
    async saveUser(): Promise<void> {
        
   
        const name = document.getElementById("Name") as any;
        const username = document.getElementById("userName") as any;
        const org = document.getElementById("OrgName") as any;


        const email = document.getElementById("Email") as any;
        const mobile = document.getElementById("Mobile") as any;
        const status = document.getElementById("Status") as any;
        const pwd=document.getElementById("userPwd") as any;
        const userRole = document.getElementById("selectRole") as any;

        Promise.all([
            name.validate(),
            username.validate(),
            org.validate(),

            email.validate(),
            mobile.validate(),
            userRole.validate()
        ]).then(async (results) => {

            const allValid = results.every(result => result === "valid");
            if (allValid) {
                console.log("User Data:", ko.toJS(this.userData));

                this.loader(true);
           
                try {
                    const response = await fetch("http://10.26.1.52:5004/create-user", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(ko.toJS(this.userData)),
                    });

                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status} ${response.statusText}`);
                    }

                    let finalResponse;
                    try {
                        finalResponse = await response.json();

                    } catch (jsonError) {
                        throw new Error("Invalid JSON response from server.");
                    }


                } catch (error) {
                    console.error("Error sending query:", error);
                } finally {
                    this.loader(false);
                }
                // Reset form fields
                this.resetForm()
                // close the dialog
                this.closeUserDialog();
            } else {
                console.error("Validation failed! Please check all fields.");
            }
        });
    }

  
    selectProfileListener(files: FileList): void {
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
    
            reader.onload = () => {
                const dataUrl = reader.result as string;
    
                // Update observable to display preview
                const currentUserData = this.userData();
                currentUserData.profilePic = dataUrl;
                this.userData.valueHasMutated(); // Notify knockout of deep change if userData is a plain observable
    
                // Optional: Send to API
                const base64String = dataUrl.split(',')[1];
                this.userData().profilePic=base64String;
            };
    
            reader.readAsDataURL(file);
        }
    }
    


    // Triggers profile file picker
    selectProfileFiles(event: ojButton.ojAction): void {

        pickFiles(this.selectProfileListener, { //  Use `pickFiles` instead of `FilePickerUtils.pickFiles`
            accept: ['image/*'],  // Accept only image types
            capture: "none",
            selectionMode: "single",
        });
    }


    // Lifecycle methods - implement if necessary 
    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void { };
    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };
    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };
    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { };
    disconnected(element: Element): void { };
};
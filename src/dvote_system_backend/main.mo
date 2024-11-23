import P "mo:base/Principal";
import Text "mo:base/Text";
import List "mo:base/List";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Error "mo:base/Error";
import Principal "mo:base/Principal";
import Random "mo:base/Random";
import Blob = "mo:base/Blob";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import AssocList "mo:base/AssocList";
import Time "mo:base/Time";
import DateTime "mo:datetime/DateTime";
import Map "mo:map/Map";
import { nhash } "mo:map/Map";
import { thash } "mo:map/Map";

shared ({ caller = initializer }) actor class () {
  type Form = {
    id : Nat;
    author : Text;
    voteType : Text;
    title : Text;
    status : Text;
    scheduledAt : Text;
    isAccessible : Bool;
  };

  type QuestionAnswer = {
    id : Nat;
    answer : Text;
  };

  type OpenFormsResults = {
    id : Nat;
    answers : [QuestionAnswer];
  };

  type SecretFormsResults = {
    id : Nat;
    answers : [QuestionAnswer];
  };

  type ManualAddedVotes = {
    formId : Nat;
    answers : [QuestionAnswer];
    user : Principal;
    editor : Principal;
  };

  //
  // ROLES AND IDENTITIES
  //
  //
  public shared ({ caller }) func greet(name : Text) : async Text {
    if (has_permission(caller, #assign_role)) {
      return "Hello, " # name # ". You have a role with administrative privileges.";
    } else if (has_permission(caller, #lowest)) {
      return "Welcome, " # name # ". You have an authorized account. Would you like to play a game?";
    } else {
      return "Greetings, " # name # ". Nice to meet you!";
    };
  };

  public type Role = {
    #owner;
    #admin;
    #authorized;
  };

  public type Permission = {
    #assign_role;
    #lowest;
  };

  private stable var roles : AssocList.AssocList<Principal, Role> = List.nil();
  private stable var role_requests : AssocList.AssocList<Principal, Role> = List.nil();

  func principal_eq(a : Principal, b : Principal) : Bool {
    return a == b;
  };

  func get_role(pal : Principal) : ?Role {
    if (pal == initializer) {
      ? #owner;
    } else {
      AssocList.find<Principal, Role>(roles, pal, principal_eq);
    };
  };

  func has_permission(pal : Principal, perm : Permission) : Bool {
    let role = get_role(pal);
    switch (role, perm) {
      case (? #owner or ? #admin, _) true;
      case (? #authorized, #lowest) true;
      case (_, _) false;
    };
  };

  func require_permission(pal : Principal, perm : Permission) : async () {
    if (has_permission(pal, perm) == false) {
      throw Error.reject("unauthorized");
    };
  };

  public shared ({ caller }) func assign_role(assignee : Principal, new_role : ?Role) : async () {
    await require_permission(caller, #assign_role);

    switch new_role {
      case (? #owner) {
        throw Error.reject("Cannot assign anyone to be the owner");
      };
      case (_) {};
    };
    if (assignee == initializer) {
      throw Error.reject("Cannot assign a role to the canister owner");
    };
    roles := AssocList.replace<Principal, Role>(roles, assignee, principal_eq, new_role).0;
    role_requests := AssocList.replace<Principal, Role>(role_requests, assignee, principal_eq, null).0;
  };

  public shared ({ caller }) func request_role(role : Role) : async Principal {
    role_requests := AssocList.replace<Principal, Role>(role_requests, caller, principal_eq, ?role).0;
    return caller;
  };

  public shared ({ caller }) func callerPrincipal() : async Principal {
    return caller;
  };

  public shared ({ caller }) func my_role() : async ?Role {
    return get_role(caller);
  };

  public shared ({ caller }) func my_role_request() : async ?Role {
    AssocList.find<Principal, Role>(role_requests, caller, principal_eq);
  };

  public shared ({ caller }) func get_role_requests() : async List.List<(Principal, Role)> {
    await require_permission(caller, #assign_role);
    return role_requests;
  };

  public shared ({ caller }) func get_roles() : async List.List<(Principal, Role)> {
    await require_permission(caller, #assign_role);
    return roles;
  };

  //
  // MOCKS
  //
  //
  //
  // Sample data for the forms
  let forms : [Form] = [
    {
      id = 1;
      voteType = "Open";
      title = "Form1";
      author = "Arnold Schwarzenneger";
      status = "open";
      scheduledAt = "01.01.1900";
      isAccessible = true;
    },
    {
      id = 2;
      voteType = "Open";
      title = "Form2";
      author = "Jan Kowalski";
      duration = 10;
      status = "completed";
      scheduledAt = "01.01.1900";
      isAccessible = true;
    },
    {
      id = 3;
      voteType = "Open";
      title = "Form3";
      author = "Jan Kowalski";
      duration = 10;
      status = "completed";
      scheduledAt = "01.01.1900";
      isAccessible = true;
    },
  ];

  public shared ({ caller }) func restrictedFunction() : async Text {
    let anononymousId = P.fromText("2vxsx-fae");

    if (caller == anononymousId) "anonymous" else P.toText(caller);
  };

  // Function to get open forms
  public query func getOpenForms() : async [Form] {
    return forms;
  };

  //
  //
  // STORE VOTING FORMS, GENERATE RANDOM FORM NUMBER - USE AS IDENTIFICATOR
  //
  //
  type FormEntry = {
    formName : Text;
    formDescription : Text;
    formDate : Text;
    formType : Text;
    voters : [Text];
    questions : [{ id : Int; questionBody : Text }];
    isHidden : Bool;
  };

  public func generateRandomId() : async Text {
    let randomBytes = await Random.blob();
    let test = Blob.toArray(randomBytes);
    let mapp = Array.map<Nat8, Text>(
      test,
      func(n : Nat8) : Text {
        Text.fromChar(
          switch (n % 16) {
            case 0 '0';
            case 1 '1';
            case 2 '2';
            case 3 '3';
            case 4 '4';
            case 5 '5';
            case 6 '6';
            case 7 '7';
            case 8 '8';
            case 9 '9';
            case 10 'a';
            case 11 'b';
            case 12 'c';
            case 13 'd';
            case 14 'e';
            case 15 'f';
            case _ { assert false; ' ' };
          }
        );
      },
    );
    let hexString = Text.join(
      "",
      mapp.vals(),
    );
    return hexString;
  };

  type ExtendedFormEntry = FormEntry and {
    createdAt : Text;
    author : Principal;
    status : Text;
  };

  // STORAGE
  stable let stableFormsStorage = Map.new<Text, ExtendedFormEntry>();
  stable let usersStorage = Map.new<Principal, UserAssignedForm>();

  // Create new form
  public shared ({ caller = author }) func createNewForm(formEntry : FormEntry) : async Text {
    let formId : Text = await generateRandomId();
    let creationTime = DateTime.now();
    let isoCreationTime = DateTime.toTextAdvanced(creationTime, #iso);

    let extendedFormEntry : ExtendedFormEntry = {
      formEntry with
      createdAt = isoCreationTime;
      author = author;
      status = "notStarted"; //notStarted, inProgress, completed
    };

    // validate id uniqueness
    let getIdByForm = Map.get(stableFormsStorage, thash, formId);

    // Handle optional value properly
    switch (getIdByForm) {
      case (null) {
        // If the form ID does not exist, add it to the storage
        Map.set(stableFormsStorage, thash, formId, extendedFormEntry);
      };
      case (?_value) {
        // If the form ID already exists, reject the request
        throw Error.reject("Form with the given ID already exists!");
      };
    };

    return formId;
  };

  // Query specific form ID
  public query func getForm(id : Text) : async ?ExtendedFormEntry {
    let getNew : ?ExtendedFormEntry = Map.get(stableFormsStorage, thash, id);

    switch (getNew) {
      case (?form) {
        ?form;
      };
      case null {
        null;
      };
    };
  };

  // filter function - get forms by status
  func getFormsByStatus(formStatus : Text) : [(Text, FormEntry)] {
    let availableForms = Map.toArray(stableFormsStorage);

    if (formStatus == "inProgress") return [];

    let filteredEntries = Array.filter<(Text, ExtendedFormEntry)>(
      availableForms,
      func((_, form)) = (form.isHidden == false and (form.status == formStatus)),
    );

    return filteredEntries;
  };

  // Query all entries from the HashMap
  public query func getAllForms(formType : Text) : async [(Text, FormEntry)] {
    // GET forms by status:
    let availableForms = getFormsByStatus(formType);

    return availableForms;
  };

  //
  // COLLECT AND HANDLE PUBLIC VOTES
  //
  //
  //
  type UserAssignedForm = {
    assignedForms : [Text];
    submittedForms : [Text];
  };

  type VoteAnswer = {
    #voteFor;
    #voteAgainst;
    #voteAbstain;
  };

  type UserPublicAnswer = {
    id : Text;
    answers : [(Nat, VoteAnswer)];
  };

  type PublicResult = {
    results : [Nat];
    shouldCollect : Bool;
    finished : Bool;
  };

};

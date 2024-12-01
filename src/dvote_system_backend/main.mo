import P "mo:base/Principal";
import Text "mo:base/Text";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Error "mo:base/Error";
import Principal "mo:base/Principal";
import Random "mo:base/Random";
import Blob = "mo:base/Blob";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import AssocList "mo:base/AssocList";
import Time "mo:base/Time";
import DateTime "mo:datetime/DateTime";
import Map "mo:map/Map";
import Order "mo:base/Order";

import { thash } "mo:map/Map";

shared ({ caller = initializer }) actor class () {
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
    #president; //prezes
    #organizationSecretary; //sekretarz organizacji
    #meetingChairperson; //przewodniczacy zebrania
    #meetingSecretary; //sekretarz zebrania
    #voter;
  };

  public type Permission = {
    #assign_role;
    #create_form;
    #read_results;
    #generate_secret_token;
    #vote;
    #lowest;
  };

  private stable var roles : AssocList.AssocList<Principal, Role> = List.nil();
  // collect users requests for roles
  private stable var role_requests : AssocList.AssocList<Principal, Role> = List.nil();

  public shared ({ caller }) func callerPrincipal() : async Principal {
    return caller;
  };

  func principal_eq(a : Principal, b : Principal) : Bool {
    return a == b;
  };

  public func getInitializer() : async Text {
    P.toText(initializer);
  };

  func has_permission(pal : Principal, perm : Permission) : Bool {
    let role = get_role(pal);
    switch (role, perm) {
      case (? #owner or ? #admin, _) true;
      case (? #organizationSecretary or ? #meetingChairperson or ? #meetingSecretary, #create_form or #vote or #read_results) true;
      case (? #voter, #vote) true;
      case (? #voter, #read_results) true;
      case (? #voter, #generate_secret_token) true;
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

  func get_role(pal : Principal) : ?Role {
    if (pal == initializer) {
      ? #owner;
    } else {
      AssocList.find<Principal, Role>(roles, pal, principal_eq);
    };
  };

  public shared ({ caller }) func my_role() : async ?Role {
    var findRole = get_role(caller);

    // get user role, by default - assign role #voter if user does not have any
    if (findRole == null) {
      roles := AssocList.replace<Principal, Role>(roles, caller, principal_eq, ? #voter).0;
      return get_role(caller);
    } else {
      return findRole;
    };
  };

  public shared ({ caller }) func get_roles() : async List.List<(Principal, Role)> {
    await require_permission(caller, #assign_role);
    return roles;
  };

  public shared ({ caller }) func get_role_requests() : async List.List<(Principal, Role)> {
    await require_permission(caller, #assign_role);
    return role_requests;
  };

  public shared ({ caller }) func my_role_request() : async ?Role {
    AssocList.find<Principal, Role>(role_requests, caller, principal_eq);
  };

  public shared ({ caller }) func request_role(role : Role) : async Principal {
    role_requests := AssocList.replace<Principal, Role>(role_requests, caller, principal_eq, ?role).0;
    return caller;
  };

  public shared ({ caller }) func restrictedFunction() : async Text {
    let anononymousId = P.fromText("2vxsx-fae");

    if (caller == anononymousId) "anonymous" else P.toText(caller);
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
    formEndDate : Text;
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

  type MutableExtendedFormEntry = FormEntry and {
    createdAt : Text;
    author : Principal;
    var status : Text;
  };

  // STORAGE
  stable let stableFormsStorage = Map.new<Text, ExtendedFormEntry>();
  stable let usersStorage = Map.new<Text, UserAssignedForm>();

  func checkAndInsertTextBuffer(buf : Buffer.Buffer<Text>, newText : Text) {
    switch (Buffer.indexOf<Text>(newText, buf, Text.equal)) {
      case null { buf.add(newText) };
      case _ { /* Do nothing, element already exists */ };
    };
  };

  // Assiggn users to usersStorage
  // create user entity if not found in userStorage
  // There will be stored info about assigned form ids and completed form ids by specific user
  private func assignUsersToForm(formIdToAssign : Text, votersToAssign : [Text]) {
    // Iterate through each user in the votersToAssign array
    for (userId in votersToAssign.vals()) {
      // Check if the user already exists in usersStorage
      let userEntry = Map.get(usersStorage, thash, userId);
      switch (userEntry) {
        // If user exists usersStorage[userId].assignedForms/submittedForms
        case (?userEntry) {
          // Check if formId already exists in assignedForms
          var assignedFormsBuffer = Buffer.fromArray<Text>(userEntry.assignedForms);
          checkAndInsertTextBuffer(assignedFormsBuffer, formIdToAssign);
          var updatedAssignedForms = Buffer.toArray(assignedFormsBuffer);

          if (Array.equal(updatedAssignedForms, userEntry.assignedForms, Text.equal) == false) {
            userEntry.assignedForms := updatedAssignedForms;
            Map.set(usersStorage, thash, userId, userEntry);
          };
        };
        // If user does not exist
        case null {
          // Create a new entry for the user and assign the formId
          let newEntry : UserAssignedForm = {
            var assignedForms = [formIdToAssign];
            var submittedForms = [];
          };
          Map.set(usersStorage, thash, userId, newEntry);
        };
      };
    };
  };

  // Create new form
  public shared ({ caller = author }) func createNewForm(formEntry : FormEntry) : async Text {
    await require_permission(author, #create_form);

    let formId : Text = await generateRandomId();
    let creationTime = DateTime.now();
    let isoCreationTime = DateTime.toTextAdvanced(creationTime, #iso);

    let formType = formEntry.formType;

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
        // Create dedicated public form aggregator
        if (formType == "public") {
          await startPublicVoteAggregator(formId);
        } else if (formType == "secret") {
          // create dedicated secret form aggregator
          await startSecretVoteAggregator(formId);
        } else {
          // if formType is other than public or secret
          throw Error.reject("Cannot create form!");
        };
        assignUsersToForm(formId, formEntry.voters);
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

  public query ({ caller = user }) func getUserForms(formType : Text) : async [(Text, FormEntry)] {
    let userTextId = P.toText(user);
    let availableForms = Map.toArray(stableFormsStorage);

    func hasVoter((_, entry) : (Text, FormEntry)) : Bool {
      Array.find<Text>(entry.voters, func(id) { id == userTextId }) != null;
    };

    func checkDate((_, entry) : (Text, ExtendedFormEntry)) : Bool {
      if (formType == "notStarted" or formType == "inProgress") {
        // incoming and current event currentDate < endDate
        var isEndDateGreater = Order.isGreater(getTime(entry.formEndDate));
        if (isEndDateGreater == true) {
          true;
        } else {
          false;
        };
      } else if (formType == "completed") {
        var isEndDateLess = Order.isLess(getTime(entry.formEndDate));

        if (isEndDateLess == true or entry.status == "completed") {
          true;
        } else {
          false;
        };
      } else {
        return false;
      };
    };

    let filteredEntries = Array.filter<(Text, ExtendedFormEntry)>(
      availableForms,
      func((id, form)) = (
        form.isHidden == false and (form.status == formType) and hasVoter((id, form)) and checkDate((id, form))
      ),
    );

    return filteredEntries;
  };

  //
  // COLLECT AND HANDLE PUBLIC VOTES
  //
  //
  //
  type UserAssignedForm = {
    var assignedForms : [Text];
    var submittedForms : [Text];
  };

  type UserAssignedFormShared = {
    assignedForms : [Text];
    submittedForms : [Text];
  };

  public func getUserStorage() : async [(Text, UserAssignedFormShared)] {
    Array.map<(Text, UserAssignedForm), (Text, UserAssignedFormShared)>(
      Map.toArray(usersStorage),
      func((id : Text, userForm : UserAssignedForm)) : (Text, UserAssignedFormShared) {
        (
          id,
          {
            assignedForms = userForm.assignedForms;
            submittedForms = userForm.submittedForms;
          },
        );
      },
    );
  };

  type VoteAnswer = {
    #voteFor;
    #voteAgainst;
    #voteAbstain;
  };

  //
  // PUBLIC FORM STORAGE || SECRET FORM STORAGE
  //
  //
  stable let publicResultsStorage = Map.new<Text, PublicForm>();
  stable let secretResultsStorage = Map.new<Text, SecretForm>(); // formId -> [{},{},{}] results
  let secretVoteTokens : SecretTokens = Buffer.Buffer<Text>(1);

  // results: principal-id and its corresponding array with answers to specific form id
  type PublicForm = {
    results : Map.Map<Text, PublicQuestionAnswers>; // PrincipalText -> [(q1a),(q2a),(q3a)]
    shouldCollect : Bool;
    finished : Bool;
  };

  // store only results without connecting it to specific principal
  type SecretForm = {
    results : PublicQuestionAnswers;
    submitters : Map.Map<Text, Bool>;
  };

  type SecretFormShared = {
    results : PublicQuestionAnswers;
    submitters : [(Text, Bool)];
  };

  // store generated tokens for secret vote
  type SecretTokens = Buffer.Buffer<Text>;

  type PublicFormShared = {
    results : [(Text, PublicQuestionAnswers)];
    shouldCollect : Bool;
    finished : Bool;
  };

  type PublicQuestionAnswers = [{
    questionId : Nat;
    answer : Text;
  }];

  // create entry to collect votes from public form
  public func startPublicVoteAggregator(formId : Text) : async () {
    let newPublicForm : PublicForm = {
      results = Map.new<Text, PublicQuestionAnswers>();
      shouldCollect = true;
      finished = false;
    };

    Map.set(publicResultsStorage, thash, formId, newPublicForm);
  };

  // create entry to collect secret votes
  public func startSecretVoteAggregator(formId : Text) : async () {
    let newSecretForm : SecretForm = {
      results = [];
      submitters = Map.new<Text, Bool>();
    };

    Map.set(secretResultsStorage, thash, formId, newSecretForm);
  };

  // get all data from public results
  public query func getPublicVoteAggregatedData() : async [(Text, PublicFormShared)] {
    var convertToArr = Map.toArray(publicResultsStorage);

    Array.map<(Text, PublicForm), (Text, PublicFormShared)>(
      convertToArr,
      func((formId : Text, form : PublicForm)) : (Text, PublicFormShared) {
        let sharedForm : PublicFormShared = {
          results = Map.toArray(form.results);
          shouldCollect = form.shouldCollect;
          finished = form.finished;
        };
        (formId, sharedForm);
      },
    );
  };

  // get all data from secret results
  public query func getSecretVoteAggregatedData() : async [(Text, SecretFormShared)] {
    var convertToArr = Map.toArray(secretResultsStorage);

    Array.map<(Text, SecretForm), (Text, SecretFormShared)>(
      convertToArr,
      func((formId : Text, form : SecretForm)) : (Text, SecretFormShared) {
        let sharedForm : SecretFormShared = {
          results = form.results;
          submitters = Map.toArray(form.submitters);
        };
        (formId, sharedForm);
      },
    );
  };

  // get results from completed secret forms
  public shared ({ caller = voter }) func getSecretFormResults(formId : Text) : async PublicQuestionAnswers {
    var formData = Map.get(stableFormsStorage, thash, formId);
    // get secretResults
    var formSecretResults = Map.get(secretResultsStorage, thash, formId);

    await require_permission(voter, #read_results);

    func checkIfFormIsCompleted() : ?Bool {
      switch (formData) {
        case (?formEntry) {
          if (formEntry.status == "completed") {
            ?true;
          } else {
            ?false;
          };
        };
        case (null) { return null };
      };
    };

    switch (formSecretResults) {
      case (?entry) {
        var convertToArr = entry.results;
        var isFormCompleted = checkIfFormIsCompleted();
        if (isFormCompleted == ?true) {
          return convertToArr;
        } else {
          return [];
        };
      };
      case (null) { return [] };
    };
  };

  // get results from completed public form
  public shared ({ caller = voter }) func getPublicFormResults(formId : Text) : async [(Text, PublicQuestionAnswers)] {
    var formData = Map.get(stableFormsStorage, thash, formId);
    var formResults = Map.get(publicResultsStorage, thash, formId);

    await require_permission(voter, #read_results);

    func checkIfFormIsCompleted() : ?Bool {
      switch (formData) {
        case (?formEntry) {
          if (formEntry.status == "completed") {
            ?true;
          } else {
            ?false;
          };
        };
        case (null) { return null };
      };
    };

    switch (formResults) {
      case (?entry) {
        var convertToArr = Map.toArray(entry.results);
        var isFormCompleted = checkIfFormIsCompleted();
        if (isFormCompleted == ?true) {
          return convertToArr;
        } else {
          return [];
        };
      };
      case (null) { return [] };
    };
  };

  // GENERATE TOKEN TO CAST SECRET VOTE
  public shared ({ caller = secretVoteCaller }) func getSecretVoteToken(formId : Text) : async {
    token : Text;
  } {
    var voterPrincipalId = P.toText(secretVoteCaller);
    await require_permission(secretVoteCaller, #generate_secret_token);

    var getSubmittedUserForms = Map.get(usersStorage, thash, voterPrincipalId);

    // check if caller is eligible to secret vote;
    // check if user did not record previous vote;
    var shouldUserStart : Bool = false;
    switch (getSubmittedUserForms) {
      case (?entry) {
        var submittedForms = Array.indexOf<Text>(formId, entry.submittedForms, Text.equal);

        switch (submittedForms) {
          case (?_value) { shouldUserStart := false };
          case (null) { shouldUserStart := true };
        };
      };
      case (null) shouldUserStart := false;
    };

    if (not shouldUserStart) {
      throw Error.reject("Vote already recorded");
    };

    let generatedToken = await generateRandomId();
    secretVoteTokens.add(generatedToken);

    {
      token = generatedToken;
    };
  };

  public shared ({ caller = secretVoteSubmitter }) func storeSecretVoteResult(formId : Text, questionsAnswers : PublicQuestionAnswers, tokenInput : Text) : async Bool {
    var tokenIndex = Buffer.contains<Text>(secretVoteTokens, tokenInput, Text.equal);

    if (not tokenIndex) {
      throw Error.reject("Cannot verify token");
    };

    var submitterPrincipalText = P.toText(secretVoteSubmitter);
    var getSecretFormAggregator = Map.get(secretResultsStorage, thash, formId); // formId: {results: [], submitters map(Text, Bool)}
    var getUserStorage = Map.get(usersStorage, thash, submitterPrincipalText); // get submitter storage - submitted forms and assigned forms ids

    switch (getSecretFormAggregator) {
      case (?entry) {
        var secretFormEntry = entry;
        // Map.set(entry.results, thash, submitterPrincipalText, questionsAnswers);
        switch (getUserStorage) {
          case (?entry) {
            var getSubmittedForm = Array.indexOf<Text>(formId, entry.submittedForms, Text.equal);

            switch (getSubmittedForm) {
              case (?_value) { return false };
              case (null) {
                // if form not submitted yet, cast secret answers and update aggregator.
                let n = Array.append<{ answer : Text; questionId : Nat }>(secretFormEntry.results, questionsAnswers);

                Map.set(secretFormEntry.submitters, thash, submitterPrincipalText, true);
                let updatedEntry = {
                  secretFormEntry with
                  results = n;
                };
                Map.set(secretResultsStorage, thash, formId, updatedEntry);

                var recordedSubmitters = Iter.toArray(Map.keys(secretFormEntry.submitters)); // get submitters list

                var e = Array.append<Text>(entry.submittedForms, [formId]);
                entry.submittedForms := e;

                // mark form as closed if caller is the last remaining voter
                // 1. get voters list from current form
                // 2. get getPublicVoteAggregatedData - for current formId, get results, collect keys of principals
                // 3. check length of both lists, if length of both is equal, then proceed else exit
                // 4. sort voters list and sort voters from aggregator, compare them
                let formData = Map.get(stableFormsStorage, thash, formId);

                switch (formData) {
                  case (?formDataEntry) {
                    var formVoters = formDataEntry.voters;
                    var sortedFormVoters = Array.sort(formVoters, Text.compare);

                    // get entry.results keys array
                    var sortedCurrentFormSubmitters = Array.sort(recordedSubmitters, Text.compare);

                    if (Array.equal(sortedFormVoters, sortedCurrentFormSubmitters, Text.equal)) {
                      let updatedEntry = {
                        formDataEntry with
                        // Update the fields you want to change
                        status = "completed"
                      };
                      Map.set(stableFormsStorage, thash, formId, updatedEntry);
                    };
                  };
                  case (null) {};
                };

                return true;
              };
            };

            return true;
          };
          case (null) { return false };
        };

        return true;
      };
      case (null) { false };
    };
  };

  // RETRIEVE PUBLIC VOTE AND STORE IN PUBLIC VOTE AGGREGATOR ENTITY
  public shared ({ caller = submitter }) func storePublicVoteResult(formId : Text, questionsAnswers : PublicQuestionAnswers) : async Bool {
    var submitterPrincipalText = P.toText(submitter);
    var getFormAggregator = Map.get(publicResultsStorage, thash, formId);
    var getUserStorage = Map.get(usersStorage, thash, submitterPrincipalText);

    switch (getFormAggregator) {
      case (?entry) {
        Map.set(entry.results, thash, submitterPrincipalText, questionsAnswers);
        var recordedSubmitters = Iter.toArray(Map.keys(entry.results));

        switch (getUserStorage) {
          case (?entry) {
            var getSubmittedForm = Array.indexOf<Text>(formId, entry.submittedForms, Text.equal);

            switch (getSubmittedForm) {
              case (?_value) { return false };
              case (null) {
                var e = Array.append<Text>(entry.submittedForms, [formId]);
                entry.submittedForms := e;

                // mark form as closed if caller is the last remaining voter
                // 1. get voters list from current form
                // 2. get getPublicVoteAggregatedData - for current formId, get results, collect keys of principals
                // 3. check length of both lists, if length of both is equal, then proceed else exit
                // 4. sort voters list and sort voters from aggregator, compare them
                let formData = Map.get(stableFormsStorage, thash, formId);

                switch (formData) {
                  case (?formDataEntry) {
                    var formVoters = formDataEntry.voters;
                    var sortedFormVoters = Array.sort(formVoters, Text.compare);
                    // get entry.results keys array
                    var sortedCurrentFormSubmitters = Array.sort(recordedSubmitters, Text.compare);

                    if (Array.equal(sortedFormVoters, sortedCurrentFormSubmitters, Text.equal)) {
                      let updatedEntry = {
                        formDataEntry with
                        // Update the fields you want to change
                        status = "completed"
                      };
                      Map.set(stableFormsStorage, thash, formId, updatedEntry);
                    };
                  };
                  case (null) {};
                };

                return true;
              };
            };

            return true;
          };
          case (null) { return false };
        };

        return true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller = test }) func checkIfCallerIsAssignedToForm(formId : Text) : async ?ExtendedFormEntry {
    var voterPrincipalId = P.toText(test);
    let getNew : ?ExtendedFormEntry = Map.get(stableFormsStorage, thash, formId);

    switch (getNew) {
      case (?form) {
        var getVoterAssignedForms = Map.get(usersStorage, thash, voterPrincipalId);
        switch (getVoterAssignedForms) {
          case (?entry) {
            var getAssignedFormIndex = Array.indexOf<Text>(formId, entry.assignedForms, Text.equal);
            switch (getAssignedFormIndex) {
              case (?_val) { ?form };
              case (null) { null };
            };
          };
          case (null) { null };
        };

      };
      case null {
        null;
      };
    };
  };

  // start form by specific user - check if assigned to form and check date constraint
  public shared ({ caller = voter }) func startForm(formId : Text) : async ?ExtendedFormEntry {
    var voterPrincipalId = P.toText(voter);
    let getNew : ?ExtendedFormEntry = Map.get(stableFormsStorage, thash, formId);
    var getSubmittedUserForms = Map.get(usersStorage, thash, voterPrincipalId);

    // check if user did not record previous vote
    var shouldUserStart : Bool = false;
    switch (getSubmittedUserForms) {
      case (?entry) {
        var submittedForms = Array.indexOf<Text>(formId, entry.submittedForms, Text.equal);

        switch (submittedForms) {
          case (?_value) { shouldUserStart := false };
          case (null) { shouldUserStart := true };
        };
      };
      case (null) shouldUserStart := false;
    };

    switch (getNew) {
      case (?form) {
        let checkDateConstraint = getTime(form.formDate);
        let checkEndDateConstraint = getTime(form.formEndDate);
        var getVoterAssignedForms = Map.get(usersStorage, thash, voterPrincipalId);

        // check if current date is between start and end date
        var isLess = Order.isLess(checkDateConstraint);
        var isGreater = Order.isGreater(checkEndDateConstraint);
        switch (isLess) {
          case (true) {
            switch (isGreater) {
              case (true) {
                switch (getVoterAssignedForms) {
                  case (?entry) {
                    var getAssignedFormIndex = Array.indexOf<Text>(formId, entry.assignedForms, Text.equal);
                    switch (getAssignedFormIndex) {
                      case (?_val) {
                        if (shouldUserStart == true) {
                          return ?form;
                        } else { throw Error.reject("Vote already recorded") };
                      };
                      case (null) { null };
                    };
                  };
                  case (null) { null };
                };
              };
              case (false) { throw Error.reject("Form expired") };
            };
          };
          case (false) { throw Error.reject("Form not started yet") };
        };
      };
      case null {
        null;
      };
    };
  };

  func isoToNanoseconds(isoDate : Text) : Time.Time {
    let format = "YYYY-MM-DDTHH:mm:ss.000Z";

    let dateTime = DateTime.fromText(isoDate, format);
    switch (dateTime) {
      case (null) {
        // Handle invalid date string
        0;
      };
      case (?dt) {
        dt.toTime();
      };
    };
  };

  func getTime(checkTime : Text) : { #equal; #greater; #less } {
    let currTime = DateTime.now();
    let checkedTime = isoToNanoseconds(checkTime);
    let getDate = DateTime.fromTime(checkedTime);
    let comp = DateTime.compare(getDate, currTime);

    return comp;
  };
};

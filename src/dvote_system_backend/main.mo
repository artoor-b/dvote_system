import P "mo:base/Principal";
import Text "mo:base/Text";
import List "mo:base/List";
import Nat "mo:base/Nat";

actor {
  // public query func getOpenForms() : async Text {
  //   return "Forms";
  // };

  // Define a structure for a Form
  type Form = {
    id : Nat;
    voteType : Text;
    title : Text;
    author : Text;
    status : Text;
    ScheduledAt : Text;
  };

  // Sample data for the forms
  let forms : [Form] = [
    {
      id = 1;
      voteType = "Open";
      title = "Form1";
      author = "Arnold Schwarzenneger";
      status = "open";
      ScheduledAt = "01.01.1900";
    },
    {
      id = 2;
      voteType = "Open";
      title = "Form2";
      author = "Jan Kowalski";
      duration = 10;
      status = "completed";
      ScheduledAt = "01.01.1900";
    },
    {
      id = 3;
      voteType = "Open";
      title = "Form3";
      author = "Jan Kowalski";
      duration = 10;
      status = "completed";
      ScheduledAt = "01.01.1900";
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
};

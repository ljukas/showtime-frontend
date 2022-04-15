import Foundation;
import CryptoKit

class CID: NSObject {

  @objc public func getCid(filePath: String?) -> String? {
    let inputString = "hey there"

   
    if #available(iOS 13.0, *) {
      
      let hashed = SHA256.hash(data: Data(inputString.utf8))
      

      let hashString = hashed.compactMap { String(format: "%02x", $0) }.joined()

      
      let cidv0 = "12" + "20" + hashString;
      print("cid ",cidv0);
    } else {
      // Fallback on earlier versions
    }
    
   
    
    return ""
  }
}

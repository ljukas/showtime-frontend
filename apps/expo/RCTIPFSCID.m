#import <React/RCTLog.h>
#import "RCTIPFSCID.h"
#import <CommonCrypto/CommonDigest.h>
#import "Showtime-Swift.h"

@implementation RCTIPFSCID

// To export a module named RCTIPFSCID
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getCID:(NSString *)filePath)
{
  CID *cid = [[CID alloc] init];
  NSString *hash = [cid getCidWithFilePath:filePath];

}

@end

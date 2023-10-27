const functions = require("firebase-functions");
const admin = require("firebase-admin");

const {onRequest} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {getDatabase} = require("firebase-admin/database");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

admin.initializeApp();
const firestore = admin.firestore();
const messaging = admin.messaging();
const db = admin.database();  // realtime database 접근

// 세션을 열었을 때 크루원들에게 서버 푸시를 보내주는 함수
exports.open_session = onRequest(async (req, res) => {
    try {
      // 대상 디바이스의 토큰 배열
      const tokens = req.body.data.tokens; // 이제 tokens 배열로부터 토큰을 가져옵니다.
      console.log("Token --> ", tokens)
  
      if (!Array.isArray(tokens)) {
        return res.status(400).json({ error: "Invalid 'tokens' parameter. It should be an array." });
      }
  
      // 푸시 메시지 설정
      const messages = tokens.map((token) => ({
        notification: {
          title: "카뮤",
          body: "운전자가 여정을 시작하였어요!",
        },
        token: token,
      }));
  
      // 여러 푸시 메시지 전송
      const responses = await Promise.all(messages.map((message) => messaging.send(message)));
      console.log("Successfully sent messages:", responses);
  
      res.status(200).json({ success: true, data: responses });
  
    } catch (error) {
      console.error("Error Sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

// 친구가 추가되었을 때 크루원들에게 서버 푸시를 보내주는 함수
exports.pushToReceiver = onRequest(async (req, res) => {
    try {
      const token = req.body.data.token; // 알림을 보낼 디바이스의 토큰값
      console.log("Token --> ", token)

        // 푸시 메시지 설정
        const messages = [
        {
            notification: {
            title: "카뮤",
            body: "새로운 친구가 추가되었어요!",
            },
            token: token,
        },
        ];
  
      // 여러 푸시 메시지 전송
      const responses = await Promise.all(messages.map((message) => messaging.send(message)));
      console.log("Successfully sent messages:", responses);
  
      res.status(200).json({ success: true, data: responses });
  
    } catch (error) {
      console.error("Error Sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

    // 늦는다는 알림을 보내주는 함수
    exports.lateNotification = onRequest(async (req, res) => {
      try {
        // 대상 디바이스의 토큰 배열
        const token = req.body.data.token; // 디바이스 토큰값 가져오기
        const lateMin = req.body.data.lateMin; // 클라이언트로부터 lateMin 받기
        console.log("Token --> ", token)
        console.log("late min ", lateMin)
    
        // 푸시 메시지 설정
        const messages = [
          {
              notification: {
              title: "카뮤",
              body: "누군가가 " + lateMin + "분 늦어요!",
              },
              token: token, // 수정된 토큰 값
          },
          ];
    
      // 여러 푸시 메시지 전송
      const responses = await Promise.all(messages.map((message) => messaging.send(message)));
      console.log("Successfully sent messages:", responses);
  
      res.status(200).json({ success: true, data: responses });
  
    } catch (error) {
      console.error("Error Sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

      // 그룹에 인원이 추가되었음을 알려주는 함수
      exports.userJoinedNotification = onRequest(async (req, res) => {
        try {
          // 방장(운전자)의 디바이스 토큰
          const token = req.body.data.token; // 디바이스 토큰값 가져오기
          const nickname = req.body.data.nickname;  // 추가된 유저 닉네임
          console.log("Token --> ", token)
          console.log("nickname --> ", nickname)

          // 푸시 메시지 설정
          const messages = [
            {
                notification: {
                title: "카뮤",
                body: nickname +"이(가) 그룹에 참여하였어요!",
                },
                token: token,
            },
            ];
      
        // 여러 푸시 메시지 전송
        const responses = await Promise.all(messages.map((message) => messaging.send(message)));
        console.log("Successfully sent messages:", responses);
    
        res.status(200).json({ success: true, data: responses });
    
      } catch (error) {
        console.error("Error Sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
      }
    });



// // 운전자에게 출발 시간 30분 전에 서버 푸시를 보내주는 함수
// exports.sendPushBeforeDeparture = onSchedule("every 1 mins")
// .timeZone('Asia/Seoul')
// .onRun(async (context) => {
//   const groupRef = getDatabase().ref('/test');
//   const userRef = getDatabase().ref('/users');
//   const snapshot = await groupRef.once('value');
//   const groupData = snapshot.val(); // /group 경로에 있는 모든 그룹 데이터

//   console.log("groupRef ", groupRef);
//   console.log("userRef ", userRef);
//   console.log("snapShot ", snapshot);
//   console.log("GroupData ", groupData);


//   const captainIDs = [];

//   // 각 그룹에서 captainId를 추출
//   for (const groupId in groupData) {
//     const group = groupData[groupId];
//     if (group && group.captainId) {
//       captainIds.push(group.captainId);
//     }
//   }

//   console.log("Captain IDs:", captainIds);
// });

// // 운전자에게 출발 시간 30분 전에 서버 푸시를 보내주는 함수
// exports.scheduledFunctionCrontab = functions.region("asia-northeast3").pubsub.schedule('* * * * *').timeZone("Asia/Seoul").onRun((context) => {
//   console.log('1분 마다 실행');
//   return null;
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {onRequest} = require("firebase-functions/v2/https");
const {getDatabase} = require("firebase-admin/database");
const {onSchedule} = require("firebase-functions/v2/scheduler");
// const {onDocumentCreated} = require("firebase-functions/v2/firestore");

admin.initializeApp();
const firestore = admin.firestore();
const messaging = admin.messaging();
const db = admin.database();  // realtime database 접근

// 운전을 시작하였을 때, 동승자들에게 푸시 알림을 전송합니다.
exports.journeyStartNotification = onRequest(async (req, res) => {
  try {
    // 방장(운전자)의 디바이스 토큰
    const token = req.body.data.token; // 디바이스 토큰값 가져오기
    console.log("Token --> ", token)
  
    // 푸시 메시지 설정
    const messages = [
      {
          notification: {
          title: "카뮤",
          body: "기사님이 운전을 시작하였어요!",
          },
          token: token,
          apns: {
            payload: {
              aps: {
                sound: "default", // iOS에서 기본 소리 사용
                // 진동을 설정하려면 아래와 같이 추가
                contentAvailable: true,
              },
            },
          },
      },
      ];
  
  const responses = await Promise.all(messages.map((message) => messaging.send(message)));
  console.log("Successfully sent messages:", responses);
  
  res.status(200).json({ success: true, data: responses });
  
  } catch (error) {
  console.error("Error Sending message:", error);
  res.status(500).json({ error: "Failed to send message" });
  }
  });

// 운전을 시작하였을 때, 동승자들에게 푸시 알림을 전송합니다.
exports.lateNotificationToPassenger = onRequest(async (req, res) => {
  try {
      // 방장(운전자)의 디바이스 토큰
      const token = req.body.data.token; // 디바이스 토큰값 가져오기
      const lateMin = req.body.data.lateMin; // 늦는 시간
      console.log("Token --> ", token);
      console.log("Late Minute ---> ", lateMin);

      // 푸시 메시지 설정
      const messages = [
          {
              notification: {
                  title: "카뮤",
                  body: "기사님이 " + lateMin +"분 늦는다고 해요",
              },
              token: token,
              apns: {
                  payload: {
                      aps: {
                          sound: "default", // iOS에서 기본 소리 사용
                          // 진동을 설정하려면 아래와 같이 추가
                          contentAvailable: true,
                      },
                  },
              },
          },
      ];

      const responses = await Promise.all(messages.map((message) => messaging.send(message)));
      console.log("Successfully sent messages:", responses);

      res.status(200).json({ success: true, data: responses });

  } catch (error) {
      console.error("Error Sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
  }
});

// 동승자가 지각할 시, 운전자에게 푸시 알림을 전송합니다.
exports.lateNotificationToDriver = onRequest(async (req, res) => {
  try {

    const token = req.body.data.token; // 운전자의 device token
    const lateMin = req.body.data.lateMin; // 클라이언트로부터 lateMin 받기
    const nickname = req.body.data.nickname;  // 지각한 사람의 닉네임

    console.log("Token --> ", token)
    console.log("late min ", lateMin)
    console.log("nickname --> ", nickname)

    // 푸시 메시지 설정
    const messages = [
      {
          notification: {
          title: "카뮤",
          body: nickname + "님이 " + lateMin + "분 늦는다고 해요",
          },
          token: token, // 수정된 토큰 값
          apns: {
            payload: {
              aps: {
                sound: "default", // iOS에서 기본 소리 사용
                // 진동을 설정하려면 아래와 같이 추가
                contentAvailable: true,
              },
            },
          },
      },
      ];

  const responses = await Promise.all(messages.map((message) => messaging.send(message)));
  console.log("Successfully sent messages:", responses);

  res.status(200).json({ success: true, data: responses });

} catch (error) {
  console.error("Error Sending message:", error);
  res.status(500).json({ error: "Failed to send message" });
}
});

// 여정 도중 동승자가 함께 가기를 포기하였을 때, 운전자에게 푸시 알림을 전송합니다.
exports.giveupNotificationToDriver = onRequest(async (req, res) => {
  try {

    const token = req.body.data.token; // 운전자의 device token
    const nickname = req.body.data.nickname;  // 지각한 사람의 닉네임
    
    console.log("Token --> ", token)
    console.log("nickname --> ", nickname)

    // 푸시 메시지 설정
    const messages = [
      {
          notification: {
          title: "카뮤",
          body: nickname + "님이 탑승을 포기하셨어요",
          },
          token: token, // 수정된 토큰 값
          apns: {
            payload: {
              aps: {
                sound: "default", // iOS에서 기본 소리 사용
                // 진동을 설정하려면 아래와 같이 추가
                contentAvailable: true,
              },
            },
          },
      },
      ];

  const responses = await Promise.all(messages.map((message) => messaging.send(message)));
  console.log("Successfully sent messages:", responses);

  res.status(200).json({ success: true, data: responses });

} catch (error) {
  console.error("Error Sending message:", error);
  res.status(500).json({ error: "Failed to send message" });
}
});

// 운전을 시작하였을 때, 동승자들에게 푸시 알림을 전송합니다.
exports.giveupNotificationToPassenger = onRequest(async (req, res) => {
  try {
    // 방장(운전자)의 디바이스 토큰
    const token = req.body.data.token; // 디바이스 토큰값 가져오기
    console.log("Token --> ", token)
  
    // 푸시 메시지 설정
    const messages = [
      {
          notification: {
          title: "카뮤",
          body: "운전자가 운행을 취소하였어요.",
          },
          token: token,
          apns: {
            payload: {
              aps: {
                sound: "default", // iOS에서 기본 소리 사용
                // 진동을 설정하려면 아래와 같이 추가
                contentAvailable: true,
              },
            },
          },
      },
      ];
  
  const responses = await Promise.all(messages.map((message) => messaging.send(message)));
  console.log("Successfully sent messages:", responses);
  
  res.status(200).json({ success: true, data: responses });
  
  } catch (error) {
  console.error("Error Sending message:", error);
  res.status(500).json({ error: "Failed to send message" });
  }
  });

  // 동승자가 그룹에 참여하였을 때, 운전자에게 푸시 알림을 전송합니다.
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
          body: nickname +"이(가) 셔틀에 참여하였어요!",
          },
          token: token,
          apns: {
            payload: {
              aps: {
                sound: "default", // iOS에서 기본 소리 사용
                // 진동을 설정하려면 아래와 같이 추가
                contentAvailable: true,
              },
            },
          },
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
  // 완료

// // 누군가가 그룹을 나갔을 때, 해당 그룹 인원들에게 푸시 알림을 전송합니다.
// exports.leftGroupNotification = onRequest(async (req, res) => {
//   try {
//     const tokens = req.body.data.tokens; // 이제 tokens 배열로부터 토큰을 가져옵니다.
//     const leftUserNickname = req.body.data.nickname;  // 나간 유저의 닉네임을 불러옵니다.
//     console.log("Token --> ", tokens)

//     if (!Array.isArray(tokens)) {
//       return res.status(400).json({ error: "Invalid 'tokens' parameter. It should be an array." });
//     }

//     // 푸시 메시지 설정
//     const messages = tokens.map((token) => ({
//       notification: {
//         title: "카뮤",
//         body: leftUserNickname + "님이 그룹을 떠났어요.",
//       },
//       token: token,
//     }));

//     // 여러 푸시 메시지 전송
//     const responses = await Promise.all(messages.map((message) => messaging.send(message)));
//     console.log("Successfully sent messages:", responses);

//     res.status(200).json({ success: true, data: responses });

//   } catch (error) {
//     console.error("Error Sending message:", error);
//     res.status(500).json({ error: "Failed to send message" });
//   }
// });

// // 운전을 시작하였을 때, 동승자들에게 푸시 알림을 전송합니다.
// exports.groupInfoChangedNotification = onRequest(async (req, res) => {
//   try {
//     // 누구한테 보낼 지 선정하기!!
//     const tokens = req.body.data.tokens; // 그룹의 동승자들의 토큰값을 받아옵니다.
//     console.log("Token --> ", tokens)

//     if (!Array.isArray(tokens)) {
//       return res.status(400).json({ error: "Invalid 'tokens' parameter. It should be an array." });
//     }

//     // 푸시 메시지 설정
//     const messages = tokens.map((token) => ({
//       notification: {
//         title: "카뮤",
//         body: "그룹의 정보가 변경되었어요!\n 수정된 정보를 확인해보세요!",
//       },
//       token: token,
//       apns: {
//         payload: {
//           aps: {
//             sound: "default", // iOS에서 기본 소리 사용
//             // 진동을 설정하려면 아래와 같이 추가
//             contentAvailable: true,
//           },
//         },
//       },
//     }));

//     // 여러 푸시 메시지 전송
//     const responses = await Promise.all(messages.map((message) => messaging.send(message)));
//     console.log("Successfully sent messages:", responses);

//     res.status(200).json({ success: true, data: responses });

//   } catch (error) {
//     console.error("Error Sending message:", error);
//     res.status(500).json({ error: "Failed to send message" });
//   }
// });
// 
  // -----------------------------------------옵셔널-----------------------------------------
// 
// 배열 처리할 때
// // 누군가가 그룹을 나갔을 때, 해당 그룹 인원들에게 푸시 알림을 전송합니다.
// exports.leftGroupNotification = onRequest(async (req, res) => {
//   try {
//     const tokens = req.body.data.tokens; // 이제 tokens 배열로부터 토큰을 가져옵니다.
//     const leftUserNickname = req.body.data.nickname;  // 나간 유저의 닉네임을 불러옵니다.
//     console.log("Token --> ", tokens)

//     if (!Array.isArray(tokens)) {
//       return res.status(400).json({ error: "Invalid 'tokens' parameter. It should be an array." });
//     }

//     // 푸시 메시지 설정
//     const messages = tokens.map((token) => ({
//       notification: {
//         title: "카뮤",
//         body: leftUserNickname + "님이 그룹을 떠났어요.",
//       },
//       token: token,
//     }));

//     // 여러 푸시 메시지 전송
//     const responses = await Promise.all(messages.map((message) => messaging.send(message)));
//     console.log("Successfully sent messages:", responses);

//     res.status(200).json({ success: true, data: responses });

//   } catch (error) {
//     console.error("Error Sending message:", error);
//     res.status(500).json({ error: "Failed to send message" });
//   }
// });

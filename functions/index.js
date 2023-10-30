const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {onRequest} = require("firebase-functions/v2/https");
// const {getDatabase} = require("firebase-admin/database");
// const {onDocumentCreated} = require("firebase-functions/v2/firestore");

admin.initializeApp();
const firestore = admin.firestore();
const messaging = admin.messaging();
const db = admin.database();  // realtime database 접근

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

  // 지각버튼을 클릭했을 때, 나머지 인원에게 푸시 알람을 전송합니다.
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

  const responses = await Promise.all(messages.map((message) => messaging.send(message)));
  console.log("Successfully sent messages:", responses);

  res.status(200).json({ success: true, data: responses });

} catch (error) {
  console.error("Error Sending message:", error);
  res.status(500).json({ error: "Failed to send message" });
}
});

// 운전을 시작하였을 때, 동승자들에게 푸시 알림을 전송합니다.
exports.journeyStartNotification = onRequest(async (req, res) => {
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

// 누군가가 그룹을 나갔을 때, 해당 그룹 인원들에게 푸시 알림을 전송합니다.
exports.leftGroupNotification = onRequest(async (req, res) => {
  try {
    const tokens = req.body.data.tokens; // 이제 tokens 배열로부터 토큰을 가져옵니다.
    const leftUserNickname = req.body.data.nickname;  // 나간 유저의 닉네임을 불러옵니다.
    console.log("Token --> ", tokens)

    if (!Array.isArray(tokens)) {
      return res.status(400).json({ error: "Invalid 'tokens' parameter. It should be an array." });
    }

    // 푸시 메시지 설정
    const messages = tokens.map((token) => ({
      notification: {
        title: "카뮤",
        body: leftUserNickname + "님이 그룹을 떠났어요.",
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

// 운전을 시작하였을 때, 동승자들에게 푸시 알림을 전송합니다.
exports.groupInfoChangedNotification = onRequest(async (req, res) => {
  try {
    // 대상 디바이스의 토큰 배열
    const tokens = req.body.data.tokens; // 그룹의 동승자들의 토큰값을 받아옵니다.
    console.log("Token --> ", tokens)

    if (!Array.isArray(tokens)) {
      return res.status(400).json({ error: "Invalid 'tokens' parameter. It should be an array." });
    }

    // 푸시 메시지 설정
    const messages = tokens.map((token) => ({
      notification: {
        title: "카뮤",
        body: "그룹의 정보가 변경되었어요!\n 수정된 정보를 확인해보세요!",
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
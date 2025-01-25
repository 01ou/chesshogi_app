import { PlayerBoardType } from "../types/apiTypes";

export const boardNameJP: Record<PlayerBoardType, string> = {
  shogi: "将棋",
  wideChess: "チェス (広い)",
  replaceShogi: "チェス (置き換え)",
  chess: "チェス",
  narrowShogi: "将棋 (狭い)",
  replaceChess: "将棋 (置き換え)"
}

export const boardExplanations: Record<PlayerBoardType, string> = {
  shogi: "将棋の配置です。",
  wideChess: "チェスの配置です。\n幅が1列分追加されています",
  replaceChess: "チェスの駒を将棋に置き換えました。\n一部オリジナルの駒が使われています",
  chess: "チェスの配置です。",
  narrowShogi: "将棋の配置です。\n幅が1列分省略されています。",
  replaceShogi: "将棋の駒をチェスに置き換えました。\n一部オリジナルの駒が使われています。",
}

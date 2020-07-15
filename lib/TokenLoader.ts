import axios from "axios";

export default class TokenLoader {
  public static tokens: any = {};

  public static async LoadOnce() {
    this.tokens = (await axios.get("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com")).data;
  }
  public static async Load(interval: number = 2 * 60 * 60 * 1000) {
    await this.LoadOnce();
    setInterval(async () => {
      await this.LoadOnce();
    }, interval);
  }

  public static Get(key: string) {
    const token = this.tokens[key];
    // Have the keys changed maybe?
    // Time to Reload and Check
    if (token == null)
      this.LoadOnce();
    return String(token);
  }
};

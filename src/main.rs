use std::env;

use futures::StreamExt;
use telegram_bot::*;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let token = env::var("TELEGRAM_BOT_TOKEN").expect("TELEGRAM_BOT_TOKEN not set");
    let api = Api::new(token);

    // Fetch new updates via long poll method
    let mut stream = api.stream();
    while let Some(update) = stream.next().await {
        // If the received update contains a new message...
        let update = update?;
        if let UpdateKind::Message(message) = update.kind {
            if let MessageKind::Text { ref data, .. } = message.kind {
                // Print chat id
                println!("{:?}", &message.chat.id());

                // Answer message with "Hi".
                api.send(message.text_reply(format!(
                    "Hi, {}! You just wrote '{}' your group chat id is {}",
                    &message.from.first_name, data, &message.chat.id()
                )))
                .await?;
            }
        }
    }
    Ok(())
}
/**
 * Telegram Bot for full-whm-exp Project
 * Bot: @whm_yourmombitch_bot
 * Token: 8333250394:AAF5V1xI0KXJo18LKcR6M0iVpGzfvqENY3Y
 */

import TelegramBot from 'node-telegram-bot-api';
import { providerManager } from './providers/manager';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8333250394:AAF5V1xI0KXJo18LKcR6M0iVpGzfvqENY3Y';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '7966587808';

export class FullWHMExpTelegramBot {
  private bot: TelegramBot;
  private isRunning: boolean = false;

  constructor() {
    this.bot = new TelegramBot(TOKEN, { polling: true });
    this.setupCommands();
    console.log('[Telegram Bot] full-whm-exp bot initialized');
  }

  private setupCommands() {
    this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
    this.bot.onText(/\/status/, (msg) => this.handleStatus(msg));
    this.bot.onText(/\/help/, (msg) => this.handleHelp(msg));
    this.bot.onText(/\/web/, (msg) => this.handleWeb(msg));
    
    // Admin commands
    this.bot.onText(/\/stats/, (msg) => this.handleStats(msg));
    this.bot.onText(/\/providers/, (msg) => this.handleProviders(msg));
    this.bot.onText(/\/test_gpt/, (msg) => this.handleTestGPT(msg));
    this.bot.onText(/\/restart/, (msg) => this.handleRestart(msg));

    this.bot.on('polling_error', (error) => {
      console.error('[Telegram Bot] Polling error:', error);
    });
  }

  private async isAdmin(chatId: string): Promise<boolean> {
    return chatId === ADMIN_CHAT_ID;
  }

  private async handleStart(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    const welcomeMessage = `🧰 **full-whm-exp Toolkit**

🔧 **Available Tools:**
• /scan <target> — OSINT Reconnaissance
• /audit <url> — Security Header Audit
• /search <query> — Global Intelligence Search
• /status — System Health Check
• /web — Dashboard Link

🌐 **Web Dashboard Tools:**
• OSINT Dashboard — Deep recon engine
• Attack Console — Network testing
• Payload Vault — SQL injection & CMS exploits
• Quantum IDE — Code execution sandbox
• AI Assistant — GPT chat
• Botnet C2 — Management tools
• Scanner — Vulnerability assessment
• Blackhat Tools — Penetration suite
• Neural AI Engine — Analysis
• Media Forge — Content generation

Use /web to access the full dashboard.`;

    await this.bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
  }

  private async handleWeb(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    await this.bot.sendMessage(chatId,
      `🌐 **Web Dashboard Access**\n\n` +
      `🔗 **URL:** https://full-whm-7vuywc3vr-kimikukiu-projects.vercel.app\n\n` +
      `✅ **Features:**\n` +
      `• AI Content Generation\n` +
      `• Auto Post Module\n` +
      `• 5-Tier Subscription System\n` +
      `• Admin Controls\n\n` +
      `📱 Fast. Secure. Professional.`,
      { parse_mode: 'Markdown' }
    );
  }

  private async handleStatus(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    try {
      const uptime = process.uptime();
      const providers = providerManager.getProviderStatus();
      
      await this.bot.sendMessage(chatId,
        `📊 **full-whm-exp Status**\n\n` +
        `✅ **Status:** Online\n` +
        `⏱️ **Uptime:** ${Math.floor(uptime / 60)} minutes\n` +
        `🤖 **Providers:** ${providers.length} available\n` +
        `💾 **Memory:** ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error fetching status');
    }
  }

  private async handleHelp(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    const isAdmin = await this.isAdmin(chatId);

    let helpText = `📖 **Available Commands**\n\n`;
    helpText += `**Public Commands:**\n`;
    helpText += `/start - Start the bot\n`;
    helpText += `/status - Check project status\n`;
    helpText += `/web - Dashboard link\n`;
    helpText += `/help - Show this help\n\n`;

    if (isAdmin) {
      helpText += `**Admin Commands:**\n`;
      helpText += `/stats - Detailed statistics\n`;
      helpText += `/providers - List GPT providers\n`;
      helpText += `/test_gpt - Test GPT generation\n`;
      helpText += `/restart - Restart the bot\n`;
    }

    await this.bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }

  private async handleProviders(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    if (!await this.isAdmin(chatId)) {
      await this.bot.sendMessage(chatId, '❌ Admin access required');
      return;
    }

    try {
      const providers = providerManager.getProviderStatus();
      let text = `🤖 **Available GPT Providers**\n\n`;
      
      providers.forEach((p: any) => {
        text += `${p.available ? '✅' : '❌'} **${p.name}**\n`;
      });

      await this.bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error fetching providers');
    }
  }

  private async handleTestGPT(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    if (!await this.isAdmin(chatId)) {
      await this.bot.sendMessage(chatId, '❌ Admin access required');
      return;
    }

    try {
      await this.bot.sendMessage(chatId, '🤖 Testing GPT generation...');
      
      const response = await providerManager.generateContent(
        'Say "Hello from full-whm-exp bot!" in 5 words or less.',
        { model: 'gpt-4o-mini', maxTokens: 20 }
      );

      await this.bot.sendMessage(chatId,
        `✅ **GPT Test Successful**\n\n` +
        `🤖 **Response:** ${response}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error: any) {
      await this.bot.sendMessage(chatId, `❌ GPT Test Failed: ${error.message}`);
    }
  }

  private async handleStats(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    if (!await this.isAdmin(chatId)) {
      await this.bot.sendMessage(chatId, '❌ Admin access required');
      return;
    }

    try {
      const stats = {
        project: 'full-whm-exp',
        nodeVersion: process.version,
        platform: process.platform,
        providers: providerManager.getProviderStatus()
      };

      await this.bot.sendMessage(chatId,
        `📊 **full-whm-exp Detailed Stats**\n\n` +
        `🖥️ **Node:** ${stats.nodeVersion}\n` +
        `💻 **Platform:** ${stats.platform}\n` +
        `🤖 **Providers:** ${stats.providers.length}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error fetching stats');
    }
  }

  private async handleRestart(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    if (!await this.isAdmin(chatId)) {
      await this.bot.sendMessage(chatId, '❌ Admin access required');
      return;
    }

    await this.bot.sendMessage(chatId, '🔄 Restarting bot...');
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[Telegram Bot] full-whm-exp bot started - polling');
  }

  public stop() {
    if (!this.isRunning) return;
    this.bot.stopPolling();
    this.isRunning = false;
    console.log('[Telegram Bot] full-whm-exp bot stopped');
  }
}

export default FullWHMExpTelegramBot;

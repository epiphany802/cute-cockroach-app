from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

# 确保必要的目录存在
try:
    os.makedirs('static/images', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
except:
    pass  # 在Vercel环境中可能没有写权限

@app.route('/')
def index():
    """主页面路由"""
    return render_template('index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    """静态文件服务"""
    return send_from_directory('static', filename)

# Vercel需要这个
app = app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)

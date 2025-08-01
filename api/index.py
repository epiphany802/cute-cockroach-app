from flask import Flask, render_template, send_from_directory
import os
import sys

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__, 
            template_folder='../templates',
            static_folder='../static')

@app.route('/')
def index():
    """主页面路由"""
    return render_template('index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    """静态文件服务"""
    return send_from_directory('../static', filename)

# Vercel需要这个
def handler(request):
    return app(request.environ, lambda status, headers: None)

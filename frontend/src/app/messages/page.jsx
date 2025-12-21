"use client";
import { useEffect, useState, useRef } from "react";
import styles from "../(withsidebar)/profile/profile.module.css"; // reuse some styles
import msgStyles from "./messages.module.css";

export default function MessagesPage(){
  const [rooms, setRooms] = useState([]); // { room, lastMessage }
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('Focused');
  const [text, setText] = useState('');
  const containerRef = useRef();

  useEffect(()=>{
    const loadRooms = async () => {
      const token = localStorage.getItem('token');
      try{
        const res = await fetch('http://localhost:5000/api/chat/rooms', { headers: { ...(token?{ Authorization: `Bearer ${token}` }:{}) } });
        const data = await res.json();
        setRooms(data.rooms || []);
        setFilteredRooms(data.rooms || []);
        if ((data.rooms||[]).length) {
          setSelectedRoom(data.rooms[0].room);
        }
      }catch(e){console.error(e)}
    };
    loadRooms();
  },[]);

  useEffect(()=>{
    setFilteredRooms(rooms.filter(r => (r.room.members.some(m => m.name.toLowerCase().includes(query.toLowerCase())) || (r.lastMessage && r.lastMessage.text && r.lastMessage.text.toLowerCase().includes(query.toLowerCase())))));
  },[query, rooms]);

  useEffect(()=>{
    if (!selectedRoom) { setMessages([]); return; }
    const loadMessages = async () => {
      const token = localStorage.getItem('token');
      try{
        const res = await fetch(`http://localhost:5000/api/chat/rooms/${selectedRoom._id}/messages`, { headers: { ...(token?{ Authorization: `Bearer ${token}` }:{}) } });
        const data = await res.json();
        setMessages(data.messages || []);

        // mark unread locally for that room as 0
        setRooms((prev) => prev.map((rr) => rr.room._id === selectedRoom._id ? { ...rr, unread: 0 } : rr));

        // scroll to bottom
        setTimeout(()=> containerRef.current && (containerRef.current.scrollTop = containerRef.current.scrollHeight), 100);
      }catch(e){console.error(e)}
    };
    loadMessages();
  },[selectedRoom]);

  const send = async () => {
    if (!text.trim() || !selectedRoom) return;
    const token = localStorage.getItem('token');
    try{
      const res = await fetch(`http://localhost:5000/api/chat/rooms/${selectedRoom._id}/messages`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...(token?{ Authorization: `Bearer ${token}` }:{}) },
        body: JSON.stringify({ text })
      });
      const msg = await res.json();
      setMessages((m)=>[...m, msg]);
      setText('');
      // update rooms lastMessage locally
      setRooms((prev) => prev.map((rr) => rr.room._id === selectedRoom._id ? { ...rr, lastMessage: msg } : rr));
      setTimeout(()=> containerRef.current && (containerRef.current.scrollTop = containerRef.current.scrollHeight), 50);
    }catch(e){console.error(e)}
  };

  const currentUser = JSON.parse(localStorage.getItem('currentUser')||'{}');

  return (
    <div className={msgStyles.wrapper}>
      <aside className={msgStyles.leftPanel}>
        <div className={msgStyles.leftHeader}>
          <h3>Messaging</h3>
          <button className={msgStyles.newMsgBtn} onClick={()=>{}}>✎</button>
        </div>

        <div className={msgStyles.searchWrap}>
          <input placeholder="Search messages" value={query} onChange={(e)=>setQuery(e.target.value)} className={msgStyles.searchInput} />
        </div>

        <div className={msgStyles.tabs}>
          {['Focused','Jobs','Unread','Connections','InMail','Starred'].map(t=> (
            <button key={t} onClick={()=>setTab(t)} className={`${msgStyles.tabBtn} ${tab===t?msgStyles.tabActive:''}`}>{t}</button>
          ))}
        </div>

        <div className={msgStyles.conversationList}>
          {filteredRooms.map(r => {
            const other = r.room.members.find(m => m._id !== currentUser._id) || r.room.members[0];
            return (
              <div key={r.room._id} onClick={()=>setSelectedRoom(r.room)} className={`${msgStyles.conversationItem} ${selectedRoom && selectedRoom._id === r.room._id ? msgStyles.active : ''}`}>
                <img src={(other && other.avatar) || '/avatar-placeholder.png'} className={msgStyles.avatar} />
                <div className={msgStyles.conversationMeta}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div style={{fontWeight:700}}>{other ? other.name : 'Group'}</div>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <div className={msgStyles.timestamp}>{r.lastMessage ? new Date(r.lastMessage.createdAt).toLocaleTimeString() : ''}</div>
                      {r.unread > 0 && <div className={msgStyles.unreadBadge}>{r.unread}</div>}
                    </div>
                  </div>
                  <div className={msgStyles.lastMsg}>
                    {r.lastMessage ? (r.lastMessage.text || (r.lastMessage.mediaUrl ? 'Media' : '')) : 'No messages yet'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </aside>

      <main className={msgStyles.middlePanel}>
        {selectedRoom ? (
          <>
            <div className={msgStyles.middleHeader}>
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                {(() => {
                  const other = (selectedRoom.members || []).find(m => m._id !== currentUser._id) || selectedRoom.members[0];
                  return (
                    <>
                      <img src={(other && other.avatar) || '/avatar-placeholder.png'} className={msgStyles.headerAvatar} />
                      <div>
                        <div style={{fontWeight:700}}>{other ? other.name : 'Conversation'}</div>
                        <div style={{fontSize:12,color:'#666'}}>Messages</div>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div style={{display:'flex', gap:8}}>
                <button className="btn">⋯</button>
              </div>
            </div>

            <div ref={containerRef} className={msgStyles.messageList}>
              {/* show a sample promotional card similar to the image when a system message exists */}
              {messages.map((m, idx) => {
                const isOutgoing = m.sender && m.sender._id === currentUser._id;
                return (
                <div key={m._id || idx} className={`${msgStyles.messageRow} ${isOutgoing ? msgStyles.outgoing : msgStyles.incoming}`}>
                  <img src={(m.sender && m.sender.avatar) || '/avatar-placeholder.png'} className={msgStyles.msgAvatar} />
                  <div className={msgStyles.msgBubble}>
                    {m.mediaUrl && m.text && m.text.length > 30 ? (
                      <div className={msgStyles.promoCard}>
                        <img src={m.mediaUrl} className={msgStyles.promoImage} />
                        <div className={msgStyles.promoContent}>
                          <div style={{ fontSize: 14, color: '#111', maxWidth: 420 }}>{m.text}</div>
                          <div className={msgStyles.ctaRow}>
                            <button className={msgStyles.ctaPrimary} onClick={async ()=>{ await fetch(`http://localhost:5000/api/chat/rooms/${selectedRoom._id}/messages`, { method: 'POST', headers: { 'Content-Type':'application/json', ...(localStorage.getItem('token')?{ Authorization: `Bearer ${localStorage.getItem('token')}` }:{}) }, body: JSON.stringify({ text: 'I am interested' }) }); setMessages(s=>[...s,{ _id: Date.now(), text:'I am interested', sender: JSON.parse(localStorage.getItem('currentUser')||'{}') }]); }}>A free trial? Sure!</button>
                            <button className={msgStyles.ctaSecondary} onClick={async ()=>{ await fetch(`http://localhost:5000/api/chat/rooms/${selectedRoom._id}/messages`, { method: 'POST', headers: { 'Content-Type':'application/json', ...(localStorage.getItem('token')?{ Authorization: `Bearer ${localStorage.getItem('token')}` }:{}) }, body: JSON.stringify({ text: 'Not interested' }) }); setMessages(s=>[...s,{ _id: Date.now(), text:'Not interested', sender: JSON.parse(localStorage.getItem('currentUser')||'{}') }]); }}>Not interested</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{fontSize:13, color:'#111', marginBottom:6}}>{m.text}</div>
                        {m.mediaUrl && <img src={m.mediaUrl} style={{width:'100%', borderRadius:8, marginTop:8}} />}
                      </>
                    )}
                  </div>
                </div>
                )
              })}

            </div>

            <div className={msgStyles.composeRow}>
              <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Write a message" className={msgStyles.composeInput} />
              <button onClick={send} className={msgStyles.sendBtn}>Send</button>
            </div>
          </>
        ) : (
          <div style={{padding:32}}>Select a conversation to view messages</div>
        )}
      </main>

      <aside className={msgStyles.rightPanel}>
        {selectedRoom ? (
          (() => {
            const other = (selectedRoom.members || []).find(m => m._id !== currentUser._id) || selectedRoom.members[0];
            return (
              <div>
                <div className={msgStyles.rightProfile}>
                  <img src={(other && other.avatar) || '/avatar-placeholder.png'} className={msgStyles.rightAvatar} />
                  <div className={msgStyles.rightInfo}>
                    <div style={{fontWeight:700}}>{other ? other.name : 'Conversation'}</div>
                    <div style={{color:'#666', fontSize:13}}>@{other ? (other.username || other.name.split(' ')[0].toLowerCase()) : ''}</div>
                  </div>
                </div>
                <div style={{color:'#666', fontSize:13}}>Conversation details and actions will appear here.</div>
              </div>
            )
          })()
        ) : (
          <div style={{color:'#777'}}>No conversation selected</div>
        )}
      </aside>
    </div>
  );
}
